import mongoose from 'mongoose'
const { Schema } = mongoose;

var MemberModelSchema = new Schema({
    ho_ten: String,
    chuc_danh: String,
    chuc_vu: String,
    ban_nganh: String,
    gioi_tinh: String,
    dan_toc: String,
    ngay_sinh: String,
    dia_chi: String,
    thuong_tru: String,
    hoi_thanh_sinh_hoat: String,
    hoi_thanh_quan_nhiem: String,
    ngay_xoa: Date,
    ngay_tao: Date,
    ngay_cap_nhat: Date,
})

export default mongoose.model('MemberModel', MemberModelSchema)