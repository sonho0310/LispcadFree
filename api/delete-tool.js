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
        const { password, tool_id, tool_category } = req.body;

        if (password !== 'admin') {
            return res.status(403).json({ error: 'Sai mật khẩu' });
        }

        if (!tool_id || !tool_category) {
            return res.status(400).json({ error: 'Thiếu thông tin tool_id hoặc tool_category' });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER || "sonho0310";
        const repo = process.env.GITHUB_REPO || "lispcad-data";

        if (!process.env.GITHUB_TOKEN) {
            return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN trên Vercel' });
        }

        // Parse category to find main database location
        let dbPath = 'database_autocad.json';
        try {
            const { data: catData } = await octokit.repos.getContent({ owner, repo, path: 'categories.json' });
            const categories = JSON.parse(Buffer.from(catData.content, 'base64').toString('utf-8'));
            const catObj = categories.find(c => c.id === tool_category);
            if (catObj && catObj.main) {
                const safeMain = catObj.main.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
                dbPath = `database_${safeMain}.json`;
            }
        } catch (err) {
            console.error("Lỗi khi đọc categories.json:", err);
        }

        // Get current database content
        let toolsFile;
        let currentTools = [];
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path: dbPath });
            toolsFile = data;
            const contentStr = Buffer.from(toolsFile.content, 'base64').toString('utf-8');
            currentTools = JSON.parse(contentStr);
        } catch (err) {
            if (err.status !== 404) throw err;
            return res.status(404).json({ error: 'Không tìm thấy database file' });
        }

        // Check if tool exists
        const toolExists = currentTools.find(t => String(t.id) === String(tool_id) || t.title === tool_id);
        if (!toolExists) {
            return res.status(404).json({ error: 'Không tìm thấy tool này trong database' });
        }

        // Filter out the tool
        const updatedTools = currentTools.filter(t => String(t.id) !== String(tool_id) && t.title !== tool_id);

        // Upload new content
        const updatedContentBase64 = Buffer.from(JSON.stringify(updatedTools, null, 2)).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner, repo,
            path: dbPath,
            message: `Xóa Tool: ${tool_id}`,
            content: updatedContentBase64,
            sha: toolsFile ? toolsFile.sha : undefined,
        });

        // Optionally, one could delete the physical `.lsp` file, but deleting the metadata is sufficient so it gets removed from the UI.
        // It prevents breaking download links that people might have already saved.

        return res.status(200).json({ success: true, deletedId: tool_id });

    } catch (error) {
        console.error('Lỗi API delete-tool:', error);
        return res.status(500).json({ error: error.message || 'Lỗi hệ thống Nội bộ' });
    }
};
