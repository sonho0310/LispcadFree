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
        const { password, main, id, name, icon } = req.body;

        if (password !== 'admin') {
            return res.status(403).json({ error: 'Sai mật khẩu Admin' });
        }

        if (!main || !id || !name) {
            return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (main, id, name)' });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER || "sonho0310";
        const repo = process.env.GITHUB_REPO || "lispcad-data";
        const dbPath = 'categories.json';

        if (!process.env.GITHUB_TOKEN) {
            return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN trên Vercel' });
        }

        let dbFile;
        let currentData = [];
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path: dbPath });
            dbFile = data;
            const contentStr = Buffer.from(dbFile.content, 'base64').toString('utf-8');
            currentData = JSON.parse(contentStr);
        } catch (err) {
            if (err.status !== 404) throw err;
        }

        const newCategory = {
            main: main.trim(),
            id: id.trim().toLowerCase().replace(/\s+/g, '_'),
            name: name.trim(),
            icon: icon || 'folder_open',
            createdAt: new Date().toISOString()
        };

        const existsIndex = currentData.findIndex(c => c.id === newCategory.id);
        if (existsIndex > -1) {
            currentData[existsIndex] = newCategory;
        } else {
            currentData.push(newCategory);
        }

        const updatedContentBase64 = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: dbPath,
            message: `Thêm/Cập nhật Thư mục: ${name}`,
            content: updatedContentBase64,
            sha: dbFile ? dbFile.sha : undefined,
        });

        return res.status(200).json({ success: true, category: newCategory });
    } catch (error) {
        console.error('Lỗi API Category:', error);
        return res.status(500).json({ error: error.message || 'Lỗi hệ thống Nội bộ' });
    }
};
