const { Octokit } = require("@octokit/rest");

module.exports = async (req, res) => {
  // Bật CORS cho phép fontend gọi tới
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Xử lý request OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Chỉ chấp nhận POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ hỗ trợ phương thức POST' });
  }

  try {
    const { id, category, title, desc, toolCode, guide } = req.body;

    // Check mandatory fields
    if (!title || !desc || !toolCode) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc (Title, Desc, Lisp Code)' });
    }

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const owner = process.env.GITHUB_OWNER || "sonhpa";
    const repo = process.env.GITHUB_REPO || "lispcad-data";
    const dbPath = 'database.json';

    if (!process.env.GITHUB_TOKEN) {
      return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN trên Vercel' });
    }

    // 1. Upload file .lsp trực tiếp lên nhánh
    // Tên file: bỏ dấu, khoảng trắng thành _, thay bằng timestamp cho chắc ăn không trùng.
    const safeName = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const isZip = req.body.isZip || false;
    const lspFileName = `${safeName}_${Date.now()}${isZip ? '.zip' : '.lsp'}`;
    const lspFilePath = `scripts/${lspFileName}`;

    // Convert LISP code to Base64
    let lspFileContentBase64;
    if (isZip) {
        // Nếu là zip, toolCode từ client gửi lên đã là base64 sẵn
        lspFileContentBase64 = toolCode;
    } else {
        lspFileContentBase64 = Buffer.from(toolCode).toString('base64');
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: lspFilePath,
      message: `Tải lên file Lisp mới: ${title}`,
      content: lspFileContentBase64,
    });

    const directDownloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${lspFilePath}`;

    // 2. Lấy nội dung file database.json hiện tại
    let dbFile;
    let currentData = [];
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: dbPath,
      });
      dbFile = data;
      // Decode Base64 thành chuỗi JSON
      const contentStr = Buffer.from(dbFile.content, 'base64').toString('utf-8');
      currentData = JSON.parse(contentStr);
    } catch (err) {
      if (err.status !== 404) {
        throw err;
      }
    }

    // 3. Thêm Tool mới vào danh sách (Sử dụng URL trực tiếp từ bước 1)
    const newTool = {
      id: id || Date.now().toString(),
      category: category || 'cad',
      title: title.trim(),
      desc: desc.trim(),
      filename: directDownloadUrl, // Dùng GitHub URL thay vì Link tải
      guide: guide ? guide.trim() : '',
      createdAt: new Date().toISOString()
    };

    currentData.push(newTool);

    // 4. Mã hóa lại thành Base64 và Upload đè database.json
    const updatedContentBase64 = Buffer.from(JSON.stringify(currentData, null, 2)).toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: dbPath,
      message: `Cập nhật database: ${title}`,
      content: updatedContentBase64,
      sha: dbFile ? dbFile.sha : undefined,
    });

    // 5. Trả về thành công
    return res.status(200).json({ success: true, tool: newTool });
  } catch (error) {
    console.error('Lỗi API Upload:', error);
    return res.status(500).json({ error: error.message || 'Lỗi hệ thống Nội bộ' });
  }
};
