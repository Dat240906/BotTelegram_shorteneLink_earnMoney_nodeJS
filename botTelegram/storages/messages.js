
import * as dotenv from 'dotenv'

dotenv.config()


var messages = {
    elseMessage: '<b>💫 Lệnh không hợp lệ. Vui lòng chọn từ danh sách lệnh hợp lệ</b>',
    accountExist: '<b>✅ Tài khoản đã được kích hoạt</b>',
    errorActiveAccount: '<b>❌ Xảy ra lỗi trong quá trình kích hoạt tài khoản</b>',
    errorGetTasks: '<b>❌ Không có nhiệm vụ hoặc đã xảy ra lỗi trong quá trình lấy nhiệm vụ</b>',
    errorValidateCodeTask: '<b>❌ Mã CODE đã hết hạn</b>',
    accountNotActive: '<b>❌ Tài khoản chưa được kích hoạt</b>',
    EmailExist: '<b>❌ Email đã tồn tại trên hệ thống, vui lòng cung cấp EMAIL khác:</b>',
    reqEmail: '<b>Vui lòng cũng cấp địa chỉ EMAIL:</b>',
    reqOtp: `

Chúng tôi đã gửi mã OTP về hòm thư của bạn, nếu bạn không nhận được Email ?:
<i>
    - hãy kiểm tra mục thư rác
    - Hoặc là email chưa đến thư của bạn, hãy chờ 30s -> 1p rồi kiểm tra lại
</i>
<b>
Vui lòng cũng cấp mã OTP gửi tới Email:
</b>`,
    reqCodeTask:'<b>Vui Lòng cung cấp mã CODE nhiệm vụ: </b>',
    reqTransferMoney:`
<b>⚠️ Chú ý: </b>

📌 <b>Dạng dữ liệu chấp nhận khi chuyển tiền</b>: <i>TelegramID Số_tiền</i>
📌 <b>Phí chuyển tiền</b>: 2% số tiền chuyển
📌 Ví dụ nếu bạn muốn chuyển tiền đến telegramID <i>123456789</i> với số tiền là <i>200,000đ</i> thì bạn sẽ ghi là:

<code>123456789 200000</code>

<b>Vui lòng cung cấp dữ liệu theo đúng dạng trên để tiến hành chuyển tiền: </b>
`,
    wrongOtp: '<b>❌ OTP không đúng, hãy nhập lại:</b>',
    trueOtp: '<b>✅ Xác thực Email thành công, bạn có thể làm nhiệm vụ kiếm tiền</b>',
    trueActive: '<b>✅ Tài khoản đã xác thực </b>',
    trueWithDrawMoney: '<b>♻️ Đặt lệnh rút tiền thành công, đang chờ thanh toán </b>',
    errorWithDrawMoney: '<b>❌ Số tiền chưa đủ điều kiện rút tối thiểu</b>',
    errorMoney: '<b>❌ Vui lòng nhập số tiền hợp lệ: </b>',
    errorAddBank: '<b>❌ Vui lòng nhập đúng định dạng: </b>',
    errorGetHistoryTransactions: '<b>❌ Xảy ra lõi trong quá trình lấy lịch sử giao dịch </b>',
    notInGroup: `<b>❌ Bạn chưa tham gia cộng đồng, hãy nhấn vào <a href="${process.env.GROUP_SUPPORT}">ĐÂY</a> để tham gia, sau đó thì có thể tiếp tục sử dụng dịch vụ</b>`,
    errorData: `<b>❌ Vui lòng nhập theo đúng định dạng: </b>`,
    transferSuccess: `<b>✅ Chuyển tiền thành công</b>`,
    // accountNotFound: '<b>❌ Tài khoản chưa được kích hoạt</b>'
} 



export default messages