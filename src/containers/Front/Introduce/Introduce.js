import React, { useMemo, Fragment } from "react";
import { makeStyles, Button } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";

const Introduce = React.memo((props) => {
  const classes = useStyle();
  const Introduce = useMemo(() => {
    return (
      <Fragment>
        <Grid>
          <h2 className={classes.h2}>
            Chức năng và nhiệm vụ của Quỹ Hỗ Trợ Lao động ngoài nước
          </h2>
          <p>
            Địa chỉ: 41B Lý Thái Tổ, Phường Lý Thái Tổ, Quận Hoàn Kiếm, Tp. Hà
            Nội
          </p>
          <p>Điện thoại: (84 - 24) 38 249 517 / (84 - 24) 38 249 518</p>
          <p>Fax: (84 - 24) 38 240 122</p>
          <p>
            Văn bản gốc:{" "}
            <a
              href={process.env.REACT_APP_UPLOAD_IMAGE_URL + "/VanBan.DOC"}
              download
            >
              <Button>
                <PictureAsPdfIcon />
              </Button>
            </a>
          </p>
          <table border="0" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td valign="top" width="30%">
                  <p align="center">
                    <strong>THỦ TƯỚNG CHÍNH PHỦ</strong>
                  </p>
                </td>
                <td valign="top" width="70%" style={{ paddingLeft: '20%' }}>
                  <p align="center">
                    <strong>
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </strong>
                  </p>
                  <p align="center">
                    <strong>Độc lập - Tự do - Hạnh phúc</strong>
                  </p>
                </td>
              </tr>
              <tr>
                <td valign="top" width="30%">
                  <p align="center">Số: 144/2007/QĐ-TTg</p>
                </td>
                <td valign="top" width="70%">
                  <p align="right">
                    <em style={{ marginRight: "20px" }}>
                      Hà Nội, ngày 31 tháng 8 năm 2007
                    </em>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <p align="center"><strong>QUYẾT ĐỊNH</strong></p>
          <p align="center">
            <strong>
              VỀ VIỆC THÀNH LẬP, QUẢN LÝ VÀ SỬ DỤNG QUỸ HỖ
              TRỢ VIỆC LÀM NGOÀI NƯỚC
            </strong>
          </p>
          <p align="center"><strong>THỦ TƯỚNG CHÍNH PHỦ</strong></p>
          <p>
            <em>
              Căn cứ Luật Tổ chức Chính phủ ngày 25 tháng
              12 năm 2001;
            </em>
          </p>
          <p>
            <em>
              Căn cứ Luật Người lao động Việt&nbsp;Nam&nbsp;đi l&agrave;m việc ở
              nước ngo&agrave;i theo hợp đồng ng&agrave;y 29 th&aacute;ng 11 năm
              2006;
            </em>
          </p>
          <p>
            <em>
              X&eacute;t đề nghị của Bộ trưởng Bộ Lao động - Thương binh
              v&agrave; X&atilde; hội tại tờ tr&igrave;nh số 43/TTr-BLĐTBXH
              <em style={{ marginRight: "20px" }}>
                ng&agrave;y 01 th&aacute;ng 8&nbsp; năm 2007,
              </em>
            </em>
          </p>{" "}
          <p align="center">QUYẾT ĐỊNH:</p>
          <p>
            <strong>
              Điều 1.&nbsp; Th&agrave;nh lập Quỹ hỗ trợ việc l&agrave;m
              ngo&agrave;i nước
            </strong>
          </p>
          <p>
            1. Th&agrave;nh lập Quỹ hỗ trợ việc l&agrave;m ngo&agrave;i nước
            tr&ecirc;n cơ sở tổ chức lại Quỹ hỗ trợ xuất khẩu lao động (được
            th&agrave;nh lập theo Quyết định số&nbsp;
            <a
              class="text-blue"
              title="Quyết định 163/2004/QĐ-TTg"
              href="https://thuvienphapluat.vn/van-ban/lao-dong-tien-luong/quyet-dinh-163-2004-qd-ttg-thanh-lap-quan-ly-su-dung-quy-ho-tro-xuat-khau-lao-dong-52360.aspx"
              target="_blank"
              rel="noopener"
            >
              163/2004/QĐ-TTg
            </a>
            &nbsp;ng&agrave;y 08 th&aacute;ng 9 năm 2004 của Thủ tướng
            Ch&iacute;nh phủ) nhằm ph&aacute;t triển v&agrave; mở rộng thị
            trường lao động ngo&agrave;i nước, n&acirc;ng cao chất lượng nguồn
            lao động, hỗ trợ giải quyết rủi ro cho người lao động v&agrave;
            doanh nghiệp.
          </p>
          <p>
            2. Quỹ hỗ trợ việc l&agrave;m ngo&agrave;i nước do Bộ Lao động -
            Thương binh v&agrave; X&atilde; hội quản l&yacute;, hoạt động
            kh&ocirc;ng v&igrave; mục đ&iacute;ch lợi nhuận, được miễn nộp thuế,
            hạch to&aacute;n độc lập, c&oacute; tư c&aacute;ch ph&aacute;p
            nh&acirc;n v&agrave; được mở t&agrave;i khoản tại Kho bạc Nh&agrave;
            nước. Số dư quỹ năm trước được chuyển sang năm sau sử dụng.
          </p>
          <p>
            <a class="clsBookmark clsopentLogin" name="dieu_2"></a>
            <strong>
              Điều 2. Nguồn h&igrave;nh th&agrave;nh v&agrave; mức đ&oacute;ng
              g&oacute;p quỹ
            </strong>
          </p>
          <p>1. Số dư Quỹ hỗ trợ xuất khẩu lao động chuyển sang.</p>
          <p>2. Đ&oacute;ng g&oacute;p của doanh nghiệp</p>
          <p>
            Doanh nghiệp hoạt động dịch vụ đưa người lao động đi l&agrave;m việc
            ở nước ngo&agrave;i theo quy định tại&nbsp;
            <a class="clsBookmark_dc clsopentLogin" name="dc_1"></a>Điều 8 của
            Luật Người lao động Việt Nam đi l&agrave;m việc ở nước ngo&agrave;i
            theo hợp đồng&nbsp;tr&iacute;ch 1% số thu tiền dịch vụ h&agrave;ng
            năm để đ&oacute;ng g&oacute;p Quỹ hỗ trợ việc l&agrave;m
            ngo&agrave;i nước.
          </p>
          <p>3. Đ&oacute;ng g&oacute;p của người lao động</p>
          <p>
            Người lao động đi l&agrave;m việc ở nước ngo&agrave;i đ&oacute;ng
            g&oacute;p Quỹ hỗ trợ việc l&agrave;m ngo&agrave;i nước mức 100.000
            đồng/người/hợp đồng.
          </p>
          <p>
            4. Hỗ trợ của ng&acirc;n s&aacute;ch nh&agrave; nước trong trường
            hợp đặc biệt theo quyết định của Thủ tướng Ch&iacute;nh phủ.
          </p>
          <p>
            <a class="clsBookmark clsopentLogin" name="dieu_3"></a>
            <strong>Điều 3. Nội dung sử dụng quỹ</strong>
          </p>
          <p>
            1. Hỗ trợ mở rộng v&agrave; ph&aacute;t triển thị trường lao động
            ngo&agrave;i nước
          </p>
          <p>
            a) Hỗ trợ tối đa 30% chi ph&iacute; hoạt động thăm d&ograve;, khảo
            s&aacute;t v&agrave; t&igrave;m hiểu c&aacute;c điều kiện của thị
            trường lao động mới, hoạt động củng cố v&agrave; ph&aacute;t triển
            thị trường lao động truyền thống;
          </p>
          <p>
            b) Hỗ trợ tối đa 50% chi ph&iacute; hoạt động quảng b&aacute; nguồn
            lao động Việt&nbsp;Nam&nbsp;ở nước ngo&agrave;i.
          </p>
          <p>
            2. Hỗ trợ đ&agrave;o tạo, bồi dưỡng n&acirc;ng cao chất lượng nguồn
            lao động:
          </p>
          <p>
            a) Hỗ trợ bồi dưỡng tay nghề, ngoại ngữ, kiến thức cần thiết cho
            người lao động đi l&agrave;m việc ở nước ngo&agrave;i:
          </p>
          <p>
            - Cung cấp miễn ph&iacute; gi&aacute;o tr&igrave;nh, t&agrave;i liệu
            bồi dưỡng ngoại ngữ, kiến thức cần thiết cho người lao động;
          </p>
          <p>
            - Hỗ trợ 50% mức học ph&iacute; bồi dưỡng tay nghề, ngoại ngữ, kiến
            thức cần thiết theo quy định cho người lao động l&agrave; con thương
            binh, liệt sĩ v&agrave; người c&oacute; c&ocirc;ng hưởng theo chế
            độ, ch&iacute;nh s&aacute;ch ưu đ&atilde;i; người lao động thuộc
            diện hộ ngh&egrave;o, người lao động l&agrave; người d&acirc;n tộc
            thiểu số.
          </p>
          <p>
            b) Hỗ trợ 20% mức học ph&iacute; bồi dưỡng n&acirc;ng cao tay nghề,
            ngoại ngữ theo quy định cho người lao động trong thời gian đầu thực
            hiện đề &aacute;n th&iacute; điểm đưa lao động đi l&agrave;m việc
            tại thị trường đ&ograve;i hỏi cao về tay nghề, ngoại ngữ.
          </p>
          <p>
            3. Hỗ trợ giải quyết rủi ro cho người lao động v&agrave; doanh
            nghiệp:
          </p>
          <p>
            a) Hỗ trợ cho người lao động trong c&aacute;c trường hợp rủi ro sau
            đ&acirc;y:
          </p>
          <p>
            - Hỗ trợ cho th&acirc;n nh&acirc;n của người lao động bị chết trong
            thời gian l&agrave;m việc ở nước ngo&agrave;i. Mức hỗ trợ 10.000.000
            đồng/trường hợp;
          </p>
          <p>
            - Trong thời gian l&agrave;m việc ở nước ngo&agrave;i theo hợp đồng,
            người lao động bị tai nạn lao động, tai nạn rủi ro, ốm đau, bệnh tật
            kh&ocirc;ng đủ sức khoẻ để tiếp tục l&agrave;m việc v&agrave; phải
            về nước trước thời hạn. Mức hỗ trợ tối đa 5.000.000 đồng/trường hợp;
          </p>
          <p>
            - Hỗ trợ cho một số trường hợp rủi ro kh&aacute;ch quan kh&aacute;c
            do Bộ trưởng Bộ lao động - Thương binh v&agrave; X&atilde; hội quyết
            định theo đề nghị của Hội đồng quản l&yacute; quỹ nhưng kh&ocirc;ng
            qu&aacute; 5.000.000 đồng/trường hợp.
          </p>
          <p>
            b) Hỗ trợ doanh nghiệp 01 v&eacute; m&aacute;y bay (một lượt) từ
            Việt Nam đến nước người lao động l&agrave;m việc trong trường hợp
            doanh nghiệp phải cử c&aacute;n bộ ra nước ngo&agrave;i để giải
            quyết rủi ro cho người lao động bị chết trong thời gian l&agrave;m
            việc ở nước ngo&agrave;i.
          </p>
          <p>
            4. Chi cho c&ocirc;ng t&aacute;c th&ocirc;ng tin tuy&ecirc;n truyền
            chủ trương, ch&iacute;nh s&aacute;ch của đảng, ph&aacute;p luật của
            Nh&agrave; nước về hoạt động đưa người lao động Việt Nam đi
            l&agrave;m việc ở nước ngo&agrave;i th&ocirc;ng qua phương tiện
            th&ocirc;ng tin đại ch&uacute;ng nhằm n&acirc;ng cao nhận thức của
            x&atilde; hội, phổ biến những m&ocirc; h&igrave;nh hiệu quả về đưa
            người lao động đi l&agrave;m việc ở nước ngo&agrave;i. Mức chi theo
            hợp đồng kinh tế đảm bảo tiết kiệm, hợp l&yacute;.
          </p>
          <p>
            5. Chi hoạt động của Hội đồng quản l&yacute; v&agrave; Ban Điều
            h&agrave;nh quỹ theo dự to&aacute;n h&agrave;ng năm được Bộ Lao động
            - Thương binh v&agrave; X&atilde; hội ph&ecirc; duyệt.
          </p>
          <strong>
            <a class="clsBookmark clsopentLogin" name="dieu_4"></a>Điều 4.&nbsp;
            Tổ chức quản l&yacute; quỹ
          </strong>
          <p>
            1. Quỹ hỗ trợ việc l&agrave;m ngo&agrave;i nước do Bộ Lao động -
            Thương binh v&agrave; X&atilde; hội quản l&yacute; th&ocirc;ng qua
            Hội đồng quản l&yacute; v&agrave; Ban Điều h&agrave;nh quỹ:
          </p>
          <p>
            a) Hội đồng quản l&yacute; quỹ gồm 05 th&agrave;nh vi&ecirc;n do Bộ
            trưởng Bộ Lao động - Thương b&iacute;nh v&agrave; X&atilde; hội bổ
            nhiệm, miễn nhiệm, bao gồm: Chủ tịch Hội đồng quản l&yacute; quỹ
            l&agrave; Thứ trưởng Bộ Lao động - Thương binh v&agrave; X&atilde;
            hội; c&aacute;c th&agrave;nh vi&ecirc;n kh&aacute;c l&agrave;
            l&atilde;nh đạo c&aacute;c đơn vị: Cục Quản l&yacute; lao động nước
            ngo&agrave;i, Vụ Kế hoạch - T&agrave;i ch&iacute;nh thuộc Bộ Lao
            động - Thương binh v&agrave; X&atilde; hội, Vụ T&agrave;i
            ch&iacute;nh đối ngoại thuộc Bộ T&agrave;i ch&iacute;nh v&agrave;
            Hiệp hội Xuất khẩu lao động Việt Nam. C&aacute;c th&agrave;nh
            vi&ecirc;n của Hội đồng quản l&yacute; hoạt động theo chế độ
            ki&ecirc;m nhiệm;
          </p>
          <p>
            b) Ban điều h&agrave;nh quỹ gồm Trưởng ban, một Ph&oacute; Trưởng
            ban, Kế to&aacute;n trưởng v&agrave; c&aacute;c bộ phận gi&uacute;p
            việc. Trưởng Ban Điều h&agrave;nh quỹ l&agrave; th&agrave;nh
            vi&ecirc;n của Hội đồng quản l&yacute; quỹ do Bộ trưởng Bộ Lao động
            - Thương binh v&agrave; X&atilde; hội bổ nhiệm, miễn nhiệm theo đề
            nghị của Hội đồng quản l&yacute; quỹ, hoạt động theo chế độ
            ki&ecirc;m nhiệm. C&aacute;c th&agrave;nh vi&ecirc;n kh&aacute;c của
            Ban Điều h&agrave;nh quỹ do Chủ tịch Hội đồng quản l&yacute; quỹ bổ
            nhiệm, miễn nhiệm theo đề nghị của Trưởng Ban Điều h&agrave;nh, hoạt
            động theo chế độ ki&ecirc;m nhiệm hoặc chuy&ecirc;n
            tr&aacute;ch.&nbsp;
          </p>
          <p>
            2. Hội đồng quản l&yacute; quỹ c&oacute; nhiệm vụ v&agrave; quyền
            hạn sau:
          </p>
          <p>
            a) Tr&igrave;nh Bộ trưởng Bộ Lao động - Thương binh v&agrave;
            X&atilde; hội quyết định hỗ trợ rủi ro cho một số trường hợp theo
            quy định tại điểm a khoản 3 Điều 3 Quyết định n&agrave;y;
          </p>
          <p>
            b) Th&ocirc;ng qua phương hướng, kế hoạch hoạt động v&agrave;
            b&aacute;o c&aacute;o quyết to&aacute;n của quỹ;
          </p>
          <p>
            c) Kiểm tra, gi&aacute;m s&aacute;t hoạt động của ban điều
            h&agrave;nh Quỹ trong việc chấp h&agrave;nh c&aacute;c ch&iacute;nh
            s&aacute;ch v&agrave; ph&aacute;p luật, thực hiện c&aacute;c quyết
            định của Hội đồng quản l&yacute; quỹ, đảm bảo việc hỗ trợ theo
            đ&uacute;ng đối tượng, nội dung, quy tr&igrave;nh chặt chẽ, thống
            nhất;
          </p>
          <p>
            d) C&aacute;c nhiệm vụ v&agrave; quyền hạn kh&aacute;c theo quy chế
            hoạt động của Hội đồng quản l&yacute; quỹ.&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
          <p>
            3. Ban Điều h&agrave;nh quỹ c&oacute; nhiệm vụ v&agrave; quyền hạn
            sau:
          </p>
          <p>
            a) Quản l&yacute; quỹ, thực hiện thu, chi v&agrave; hỗ trợ theo
            đ&uacute;ng mục đ&iacute;ch, đ&uacute;ng&nbsp; nội dung v&agrave;
            đ&uacute;ng đối tượng;
          </p>
          <p>
            b) Lập, tổng hợp kế hoạch thu, dự to&aacute;n chi v&agrave; quyết
            to&aacute;n h&agrave;ng năm của quỹ tr&igrave;nh Bộ Lao động -
            Thương binh v&agrave; X&atilde; hội ph&ecirc; duyệt;
          </p>
          <p>
            c) C&aacute;c nhiệm vụ v&agrave; quyền hạn kh&aacute;c theo quy chế
            hoạt động của Ban Điều h&agrave;nh quỹ.
          </p>
          <p>
            <strong>Điều 5.&nbsp; Tr&aacute;ch nhiệm của c&aacute;c Bộ</strong>
          </p>
          <p>
            1. Tr&aacute;ch nhiệm của Bộ Lao động - Thương binh v&agrave;
            X&atilde; hội:
          </p>
          <p>
            <a name="diem_a_1_5"></a>a) Chủ tr&igrave;, phối hợp với Bộ
            T&agrave;i ch&iacute;nh quy định cụ thể v&agrave; hướng dẫn
            c&aacute;ch thức đ&oacute;ng g&oacute;p quỹ; quy tr&igrave;nh
            v&agrave; thủ tục chi hỗ trợ; chi quản l&yacute; v&agrave; quyết
            to&aacute;n quỹ;
          </p>
          <p>
            b) Thống nhất với Bộ T&agrave;i ch&iacute;nh tr&igrave;nh Thủ tướng
            Ch&iacute;nh phủ quyết định hỗ trợ kinh ph&iacute; từ ng&acirc;n
            s&aacute;ch nh&agrave; nước cho quỹ trong trường hợp đặc biệt;
          </p>
          <p>
            c) Quyết định th&agrave;nh lập, ban h&agrave;nh quy chế l&agrave;m
            việc của Hội đồng quản l&yacute; v&agrave; Ban Điều h&agrave;nh quỹ.
          </p>
          <p>2. Tr&aacute;ch nhiệm của Bộ T&agrave;i ch&iacute;nh:</p>{" "}
          <p>
            a) Phối hợp với Bộ Lao động - Thương binh v&agrave; X&atilde; hội
            thực hiện c&aacute;c nội dung quy định tại c&aacute;c điểm a
            v&agrave; b khoản 1 Điều n&agrave;y;
          </p>
          <p>
            b) Kiểm tra, gi&aacute;m s&aacute;t việc quản l&yacute; v&agrave; sử
            dụng quỹ theo đ&uacute;ng quy định của ph&aacute;p luật.
          </p>
          <p>
            <strong>Điều 6.&nbsp;</strong>Quyết định n&agrave;y c&oacute; hiệu
            lực thi h&agrave;nh sau 15 ng&agrave;y, kể từ ng&agrave;y đăng
            C&ocirc;ng b&aacute;o v&agrave; thay thế Quyết định số&nbsp;
            <a
              class="text-blue"
              title="Quyết định 163/2004/QĐ-TTg"
              href="https://thuvienphapluat.vn/van-ban/lao-dong-tien-luong/quyet-dinh-163-2004-qd-ttg-thanh-lap-quan-ly-su-dung-quy-ho-tro-xuat-khau-lao-dong-52360.aspx"
              target="_blank"
              rel="noopener"
            >
              163/2004/QĐ-TTg
            </a>
            &nbsp;ng&agrave;y 08 th&aacute;ng 9 năm 2004 của Thủ tướng
            Ch&iacute;nh phủ về việc th&agrave;nh lập, quản l&yacute; v&agrave;
            sử dụng Quỹ hỗ trợ xuất khẩu lao động.
          </p>
          <p>
            <strong>Điều 7.&nbsp;&nbsp;</strong>C&aacute;c Bộ trưởng, Thủ trưởng
            cơ quan ngang Bộ, Thủ trưởng cơ quan thuộc Ch&iacute;nh phủ, Chủ
            tịch Ủy ban nh&acirc;n d&acirc;n c&aacute;c tỉnh, th&agrave;nh phố
            trực thuộc Trung ương v&agrave; Thủ trưởng c&aacute;c cơ quan
            li&ecirc;n quan chịu tr&aacute;ch nhiệm thi h&agrave;nh Quyết định
            n&agrave;y./.
          </p>
          <table border="0" width="100%" cellspacing="0" cellpadding="0">
            <tbody>
              <tr>
                <td valign="top" width="60%">
                  <p>
                    <em>Nơi nhận:</em>
                  </p>
                  <p>- Ban B&iacute; thư Trung ương Đảng;</p>
                  <p>
                    - Thủ tướng, c&aacute;c Ph&oacute; Thủ tướng Ch&iacute;nh
                    phủ;
                  </p>
                  <p>- C&aacute;c Bộ, cơ quan ngang Bộ, cơ quan thuộc CP;</p>
                  <p>
                    - Văn ph&ograve;ng BCĐTW về ph&ograve;ng, chống tham nhũng;
                  </p>
                  <p>- HĐND, UBND c&aacute;c tỉnh, th&agrave;nh phố</p>
                  <p>&nbsp;&nbsp; trực thuộc Trung ương;</p>
                  <p>
                    - Văn ph&ograve;ng Trung ương v&agrave; c&aacute;c Ban của
                    Đảng;
                  </p>
                  <p>- Văn ph&ograve;ng Chủ tịch nước;</p>
                  <p>
                    - Hội đồng D&acirc;n tộc v&agrave; c&aacute;c Ủy ban của
                    Quốc hội;
                  </p>
                  <p>- Văn ph&ograve;ng Quốc hội;</p>
                  <p>- To&agrave; &aacute;n nh&acirc;n d&acirc;n tối cao;</p>
                  <p>- Viện Kiểm s&aacute;t nh&acirc;n d&acirc;n tối cao;</p>
                  <p>- Kiểm to&aacute;n Nh&agrave; nước;</p>
                  <p>- Ủy ban Mặt trận Tổ quốc Việt Nam;</p>
                  <p>- Cơ quan Trung ương của c&aacute;c đo&agrave;n thể,</p>
                  <p>- VPCP: BTCN, c&aacute;c PCN,</p>
                  <p>
                    &nbsp;&nbsp; Website Ch&iacute;nh phủ, Ban Điều h&agrave;nh
                    112,
                  </p>
                  <p>
                    &nbsp;&nbsp; Người ph&aacute;t ng&ocirc;n của Thủ tướng
                    Ch&iacute;nh phủ,
                  </p>
                  <p>
                    &nbsp;&nbsp; c&aacute;c Vụ, Cục, đơn vị trực thuộc,
                    C&ocirc;ng b&aacute;o;
                  </p>
                  <p>- Lưu: Văn thư, KTTH (5b). A.</p>
                </td>
                <td valign="top" width="40%">
                  <h1 align="center">THỦ TƯỚNG</h1>
                  <p align="center">
                    <strong>&nbsp;</strong>
                  </p>
                  <p align="center">
                    <strong>&nbsp;</strong>
                  </p>
                  <p align="center">
                    <strong>Nguyễn Tấn Dũng</strong>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <div className={classes.othernews}>
          <fieldset>
            <legend></legend>
          </fieldset>
        </div>
      </Fragment>
    );
  });
  return <Grid className={classes.root}>{Introduce}</Grid>;
});
const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "800px",
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "justify",
    marginRight: 40,
    boxShadow: "inset -1px 0px 0px #E4E4E4",
    paddingRight: 51.5,
    [theme.breakpoints.between("aa", "md")]: {
      padding: "0 10px",
      width: "100%",
      flexWrap: "wrap",
      maxWidth: "100%",
    },
    [theme.breakpoints.between("sm", 960)]: {
      padding: "0 10px",
      width: "100%",
      maxWidth: "100%",
      marginRight: 0,
      boxShadow: "none",
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      boxShadow: "none",
      margin: 0,
      padding: "0px 15px",
    },

  },
  h2: {
    color: "#c80d14",
  },
  othernews: {
    "& fieldset": {
      width: "100%",
      border: "none",
      border: "none",
      borderTop: "1px solid #E4E4E4",
      padding: "0px",
    },
    "& legend": {
      padding: "0px 0px 14px 0px",
    },
    "& h2": {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontStyle: "normal",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}));
export default Introduce;
