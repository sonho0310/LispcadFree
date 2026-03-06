const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER || "sonho0310";
        const repo = process.env.GITHUB_REPO || "lispcad-data";

        // Fetch categories
        let currentCats = [];
        try {
            const { data } = await octokit.repos.getContent({ owner, repo, path: 'categories.json' });
            const contentStr = Buffer.from(data.content, 'base64').toString('utf-8');
            try { currentCats = JSON.parse(contentStr); }
            catch (e) { currentCats = JSON.parse(contentStr.replace(/,\s*([\]}])/g, '$1')); }
        } catch (err) { }

        // Fetch mains
        const mains = [...new Set(currentCats.map(c => {
            return (c.main || 'autocad').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        }))];
        if (mains.length === 0) mains.push('autocad');

        // Fetch all databases
        const fetchPromises = mains.map(async main => {
            try {
                const { data } = await octokit.repos.getContent({ owner, repo, path: `database_${main}.json` });
                const contentStr = Buffer.from(data.content, 'base64').toString('utf-8');
                try { return JSON.parse(contentStr); }
                catch (e) { return JSON.parse(contentStr.replace(/,\s*([\]}])/g, '$1')); }
            } catch (err) {
                return [];
            }
        });

        const results = await Promise.all(fetchPromises);
        const allTools = results.flat();

        return res.status(200).json({ categories: currentCats, tools: allTools });
    } catch (error) {
        console.error('Lỗi API get-database:', error);
        return res.status(500).json({ error: error.message || 'Lỗi hệ thống Nội bộ' });
    }
};
