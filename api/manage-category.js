const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Chỉ hỗ trợ phương thức POST' });
    }

    try {
        const { password, action, id_to_delete, id_target, order } = req.body;

        if (password !== 'admin') {
            return res.status(403).json({ error: 'Sai mật khẩu' });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER || "sonho0310";
        const repo = process.env.GITHUB_REPO || "lispcad-data";
        const dbCatPath = 'categories.json';

        if (!process.env.GITHUB_TOKEN) {
            return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN trên Vercel' });
        }

        let currentCats = [];
        let catFile;
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path: dbCatPath });
            catFile = data;
            const contentStr = Buffer.from(catFile.content, 'base64').toString('utf-8');
            currentCats = JSON.parse(contentStr);
        } catch (err) {
            if (err.status !== 404) throw err;
        }

        if (action === 'delete') {
            if (!id_to_delete || !id_target) return res.status(400).json({ error: 'Thiếu thông tin xóa' });

            const catToDelete = currentCats.find(c => c.id === id_to_delete);
            const catTarget = currentCats.find(c => c.id === id_target);

            const safeMainSource = (catToDelete ? catToDelete.main : 'autocad').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
            const safeMainTarget = (catTarget ? catTarget.main : 'autocad').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

            const dbSourcePath = `database_${safeMainSource}.json`;
            const dbTargetPath = `database_${safeMainTarget}.json`;

            // Remove from categories
            const filterCats = currentCats.filter(c => c.id !== id_to_delete);
            const updatedCatBase64 = Buffer.from(JSON.stringify(filterCats, null, 2)).toString('base64');

            await octokit.repos.createOrUpdateFileContents({
                owner, repo,
                path: dbCatPath,
                message: `Xóa Thư mục: ${id_to_delete}`,
                content: updatedCatBase64,
                sha: catFile ? catFile.sha : undefined,
            });

            // Re-assign tools
            try {
                let toolsFileSource;
                let currentToolsSource = [];
                try {
                    const { data } = await octokit.repos.getContent({ owner, repo, path: dbSourcePath });
                    toolsFileSource = data;
                    currentToolsSource = JSON.parse(Buffer.from(toolsFileSource.content, 'base64').toString('utf-8'));
                } catch (e) { }

                if (dbSourcePath === dbTargetPath) {
                    let updated = false;
                    currentToolsSource.forEach(t => {
                        if (t.category === id_to_delete) {
                            t.category = id_target;
                            updated = true;
                        }
                    });
                    if (updated) {
                        await octokit.repos.createOrUpdateFileContents({
                            owner, repo, path: dbSourcePath,
                            message: `Cập nhật category tool sang ${id_target}`,
                            content: Buffer.from(JSON.stringify(currentToolsSource, null, 2)).toString('base64'),
                            sha: toolsFileSource ? toolsFileSource.sha : undefined,
                        });
                    }
                } else {
                    let toolsToMove = [];
                    let remainingToolsSource = [];
                    currentToolsSource.forEach(t => {
                        if (t.category === id_to_delete) {
                            t.category = id_target;
                            toolsToMove.push(t);
                        } else {
                            remainingToolsSource.push(t);
                        }
                    });

                    if (toolsToMove.length > 0) {
                        // Update Source
                        await octokit.repos.createOrUpdateFileContents({
                            owner, repo, path: dbSourcePath,
                            message: `Remove tools moved to ${id_target}`,
                            content: Buffer.from(JSON.stringify(remainingToolsSource, null, 2)).toString('base64'),
                            sha: toolsFileSource ? toolsFileSource.sha : undefined,
                        });

                        // Update Target
                        let toolsFileTarget;
                        let currentToolsTarget = [];
                        try {
                            const { data } = await octokit.repos.getContent({ owner, repo, path: dbTargetPath });
                            toolsFileTarget = data;
                            currentToolsTarget = JSON.parse(Buffer.from(toolsFileTarget.content, 'base64').toString('utf-8'));
                        } catch (e) { }

                        currentToolsTarget.push(...toolsToMove);

                        await octokit.repos.createOrUpdateFileContents({
                            owner, repo, path: dbTargetPath,
                            message: `Receive tools from ${id_to_delete}`,
                            content: Buffer.from(JSON.stringify(currentToolsTarget, null, 2)).toString('base64'),
                            sha: toolsFileTarget ? toolsFileTarget.sha : undefined,
                        });
                    }
                }
            } catch (err) {
                console.log("Không lấy được modules.json để update", err);
            }

            return res.status(200).json({ success: true, updatedCategories: filterCats });
        } else if (action === 'reorder') {
            if (!Array.isArray(order)) return res.status(400).json({ error: 'Thứ tự không hợp lệ' });

            // Create new ordered array
            let orderedCats = [];
            order.forEach(id => {
                const found = currentCats.find(c => c.id === id);
                if (found) orderedCats.push(found);
            });
            // Ensure any missed are appended
            currentCats.forEach(c => {
                if (!orderedCats.find(o => o.id === c.id)) orderedCats.push(c);
            });

            const updatedCatBase64 = Buffer.from(JSON.stringify(orderedCats, null, 2)).toString('base64');

            await octokit.repos.createOrUpdateFileContents({
                owner, repo,
                path: dbCatPath,
                message: `Cập nhật thứ tự thư mục`,
                content: updatedCatBase64,
                sha: catFile ? catFile.sha : undefined,
            });

            return res.status(200).json({ success: true, updatedCategories: orderedCats });
        }

        return res.status(400).json({ error: 'Action không hợp lệ' });

    } catch (error) {
        console.error('Lỗi API manage-category:', error);
        return res.status(500).json({ error: error.message || 'Lỗi hệ thống Nội bộ' });
    }
};
