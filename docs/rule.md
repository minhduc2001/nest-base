Cú pháp của một commit message

    <loại commit>(phạm vi): Nội dung commit
Ví dụ: `feat(todo): Thêm tính năng đánh dấu công việc đã hoàn thành`.

Theo quy ước này, một commit message bao gồm ba phần chính:

1.  **Loại commit**: Loại commit đặc tả mục đích của commit, như là một tính năng mới (feat), một sửa lỗi (fix), một thay đổi về tài liệu (docs), một cải tiến về kiểu dáng (style), một sự tái cấu trúc (refactor), một bài kiểm tra (test), hoặc một sự thay đổi về quản lý mã (chore).

2.  **Phạm vi**: Phạm vi đặc tả phần của hệ thống hoặc chức năng được tác động bởi commit. Ví dụ, nếu commit liên quan đến một tính năng cụ thể, phạm vi có thể là tên của tính năng đó, như "todo".

3.  **Nội dung commit**: Nội dung commit đặc tả sự thay đổi cụ thể được thực hiện trong commit. Ví dụ, "Thêm tính năng đánh dấu công việc đã hoàn thành".


Bạn có thể tạo commit message theo quy ước này bằng cách sử dụng lệnh `git commit -m "<loại commit>(phạm vi): Nội dung commit"`. Ví dụ, để tạo một commit với nội dung "Thêm tính năng đánh dấu công việc đã hoàn thành" cho tính năng "todo", bạn có thể sử dụng lệnh sau:

    git  commit  -m "feat(todo): Thêm  tính  năng đánh  dấu  công  việc đã hoàn  thành"
    

