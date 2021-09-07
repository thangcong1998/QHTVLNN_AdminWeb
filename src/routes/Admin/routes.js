import { lazy } from "react";

const CategoryList = lazy(() =>
  import("../../containers/Admin/Category/CategoryList")
);
const Dashboard = lazy(() =>
  import("../../containers/Admin/Dashboard/Dashboard")
);
const CategoryForm = lazy(() =>
  import("../../containers/Admin/Category/CategoryForm")
);
const ArticleList = lazy(() =>
  import("../../containers/Admin/Article/ArticleList")
);
const DocumentList = lazy(() =>
  import("../../containers/Admin/Document/DocumentList")
);
const DocumentForm = lazy(() =>
  import("../../containers/Admin/Document/DocumentForm")
);
const ArticleForm = lazy(() =>
  import("../../containers/Admin/ArticleForm/ArticleForm.js")
);
const CountriesList = lazy(() =>
  import("../../containers/Admin/Countries/CountriesList.js")
);
const CountriesFrom = lazy(() =>
  import("../../containers/Admin/Countries/CountriesFrom.js")
);
const CompanyTypesList = lazy(() =>
  import("../../containers/Admin/CompanyTypes/CompanyTypesList.js")
);
const CompanyTypesForm = lazy(() =>
  import("../../containers/Admin/CompanyTypes/CompanyTypesForm")
);
const JobTitlesList = lazy(() =>
  import("../../containers/Admin/JobTitles/JobTitlesList.js")
);
const JobTitlesForm = lazy(() =>
  import("../../containers/Admin/JobTitles/JobTitlesForm.js")
);
const DepartmentsList = lazy(() =>
  import("../../containers/Admin/Departments/DepartmentsList")
);
const FrontSettingList = lazy(() =>
  import("../../containers/Admin/FrontSetting/FrontSettingList.js")
);
const FrontSetting = lazy(() =>
  import("../../containers/Admin/FrontSetting/FrontSetting.js")
);
const FrontSettingForm = lazy(() =>
  import("../../containers/Admin/FrontSetting/FrontSettingForm.js")
);
const RoleList = lazy(() => import("../../containers/Admin/Role/RoleList.js"));
const RoleForm = lazy(() => import("../../containers/Admin/Role/RoleForm.js"));
const PreviewArticle = lazy(() =>
  import("../../containers/Admin/ArticleForm/Preview/Preview")
);
const Audit = lazy(() => import("../../containers/Admin/Audit/Audit"));
const RegionsList = lazy(() =>
  import("../../containers/Admin/Regions/RegionsList")
);
const RegionForm = lazy(() =>
  import("../../containers/Admin/Regions/RegionForm")
);
const CompaniesList = lazy(() =>
  import("../../containers/Admin/Companies/CompaniesList.js")
);
const CompaniesForm = lazy(() =>
  import("../../containers/Admin/Companies/CompaniesForm.js")
);
const LaborDepart = lazy(() =>
  import("../../containers/Admin/LaborDepartments/laborDepartmentsList")
);
const LaborForm = lazy(() =>
  import("../../containers/Admin/LaborDepartments/laborDepartMentsForm")
);
const UserList = lazy(() => import("../../containers/Admin/User/UserList"));
const UserForm = lazy(() => import("../../containers/Admin/User/UserForm"));
const SettlementList = lazy(() =>
  import("../../containers/Admin/Settlement/SettlementList")
);

const SchoolFeeSupportForm = lazy(() => import("../../containers/Admin/Support/SchoolFeeSupportForm"));
const LaborSupportCreate = lazy(() => import("../../containers/Admin/LaborSupportRequest/LaborSupportCreate"));
const SettlementsForm = lazy(() =>
  import("../../containers/Admin/Settlement/SettlementsForm")
);
const SettlementCreate = lazy(() =>
  import("../../containers/Admin/Settlement/SettlementCreate2")
);
const LaborSupportList = lazy(() => import("../../containers/Admin/LaborSupportRequest/LaborSupportList"));
const SettlementEdit = lazy(() => import("../../containers/Admin/Settlement/SettlementEdit"));
const SchoolFeeSupportRequestList = lazy(() => import("../../containers/Admin/Support/SchoolFeeSupportRequestList"));
const OtherSupportRequest = lazy(() => import("../../containers/Admin/OtherSupportRequest/OtherSupportRequestList"));
const OtherSupportRequestForm = lazy(() => import("../../containers/Admin/OtherSupportRequest/OtherSupportRequestForm"));

const DocumentSupportRequestList = lazy(() =>
  import(
    "../../containers/Admin/SupportRequest/DocumentSupportRequest/DocumentSupportRequestList"
  )
);
const DocumentSupportForm = lazy(() =>
  import(
    "../../containers/Admin/SupportRequest/DocumentSupportRequest/DocumentSupportForm"
  )
);
const Report = lazy(() => import("../../containers/Admin/Report/Report"));
export const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/category",
    name: "Danh mục",
    perm: "articleCategory_manage",
    component: CategoryList,
  },
  {
    path: "/category/create",
    name: "Thêm danh mục",
    perm: "articleCategory_manage",
    component: CategoryForm,
  },
  {
    path: "/article",
    name: "Bài viết",
    perm: "article_view",
    component: ArticleList,
  },
  {
    path: "/document",
    name: "Văn bản",
    perm: "document_view",
    component: DocumentList,
  },
  {
    path: "/document/create",
    name: "Thêm văn bản",
    perm: "document_manage",
    component: DocumentForm,
  },
  {
    path: "/document/:id",
    name: "Thông tin văn bản",
    perm: "document_manage",
    component: DocumentForm,
  },
  {
    path: "/article/create",
    name: "Thêm mới bài viết",
    perm: "article_manage",
    component: ArticleForm,
  },
  {
    path: "/article/:id",
    name: "Chi tiết bài viết",
    perm: "article_manage",
    component: ArticleForm,
  },
  {
    path: "/previewArticle/:id",
    name: "Xem trước bài viết",
    perm: "article_view",
    component: PreviewArticle,
  },
  {
    path: "/setting",
    name: "Cài đặt hiển thị thông tin liên lạc",
    perm: "frontSetting_manage",
    component: FrontSettingList,
  },
  {
    path: "/setting/create",
    name: "Thêm mới thông tin liên lạc",
    perm: "frontSetting_manage",
    component: FrontSettingForm,
  },
  {
    path: "/setting/:id",
    name: "Chỉnh sửa thông tin liên lạc",
    perm: "frontSetting_manage",
    component: FrontSettingForm,
  },
  {
    path: "/countries",
    name: "Thị trường lao động",
    perm: "countries_view",
    component: CountriesList,
  },
  {
    path: "/countries/create",
    name: "Thêm thị trường lao động mới",
    perm: "countries_manage",
    component: CountriesFrom,
  },
  {
    path: "/countries/:id",
    name: "Chỉnh sửa thị trường lao động",
    perm: "countries_manage",
    component: CountriesFrom,
  },
  {
    path: "/companyTypes",
    name: "Loại công ty",
    perm: "companyTypes_view",
    component: CompanyTypesList,
  },
  {
    path: "/jobTitles",
    name: "Chức vụ",
    perm: "jobTitles_view",
    component: JobTitlesList,
  },
  {
    path: "/departments",
    name: "Phòng ban",
    perm: "department_view",
    component: DepartmentsList,
  },
  {
    path: "/role",
    name: "Nhóm người dùng",
    perm: "role_view",
    component: RoleList,
  },
  {
    path: "/role/create",
    name: "Thêm nhóm người dùng",
    perm: "role_manage",
    component: RoleForm,
  },
  {
    path: "/role/:id",
    name: "Sửa thông tin nhóm người dùng",
    perm: "role_manage",
    component: RoleForm,
  },
  {
    path: "/regions",
    name: "Đơn vị hành chính",
    perm: "",
    component: RegionsList,
  },
  {
    path: "/regions/create",
    name: "Chi tiết đơn vị",
    perm: "",
    component: RegionForm,
  },
  {
    path: "/regions/:id",
    name: "Chi tiết tài liệu",
    perm: "",
    component: RegionForm,
  },
  {
    path: "/audit",
    name: "Lịch sử thay đổi dữ liệu",
    perm: "",
    component: Audit,
  },
  {
    path: "/companies",
    name: "Danh sách doanh nghiệp",
    perm: "companies_view",
    component: CompaniesList,
  },
  {
    path: "/companies/create",
    name: "Thêm doanh nghiệp mới",
    perm: "companies_manage",
    component: CompaniesForm,
  },
  {
    path: "/companies/:id",
    name: "Thông tin doanh nghiệp",
    perm: "companies_manage",
    component: CompaniesForm,
  },
  {
    path: "/laborDepartment",
    name: "Thông tin sở LĐ-XH",
    perm: "",
    component: LaborDepart,
  },
  {
    path: "/laborDepartment/create",
    name: "Thêm mới sở LĐ-XH",
    perm: "",
    component: LaborForm,
  },
  {
    path: "/laborDepartment/:id",
    name: "Chi tiết sở LĐ-XH",
    perm: "",
    component: LaborForm,
  },
  {
    path: "/user",
    name: "Danh sách tài khoản",
    perm: "user_view",
    component: UserList,
  },
  {
    path: "/user/create",
    name: "Thêm mới tài khoản",
    perm: "user_manage",
    component: UserForm,
  },
  {
    path: "/user/:id",
    name: "Cập nhật tài khoản",
    perm: "user_manage",
    component: UserForm,
  },
  {
    path: "/settlement",
    name: "Quyết toán",
    perm: "settlement_view",
    component: SettlementList,
  },
  {
    path: "/settlement/create",
    name: "Thêm mới quyết toán theo thu nhập",
    perm: "settlement_manage",
    component: SettlementsForm,
  },
  {
    path: "/settlement/create2",
    name: "Thêm mới quyết toán theo người lao động",
    perm: "settlement_manage",
    component: SettlementCreate,
  },
  {
    path: "/settlement/:id",
    name: "Thông tin quyết toán",
    perm: "settlement_view",
    component: SettlementEdit,
  },
  {
    path: '/laborSupport',
    name: 'Hỗ trợ rủi ro',
    perm: '',
    component: LaborSupportList,
  },
  {
    path: '/laborSupport/create',
    name: 'Thêm mới yêu cầu hỗ trợ rủi ro',
    perm: '',
    component: LaborSupportCreate,
  },
  {
    path: '/laborSupport/:id',
    name: 'Thông tin yêu cầu hỗ trợ rủi ro',
    perm: '',
    component: LaborSupportCreate,
  },
  {
    path: '/schoolFeeSupport',
    name: 'Yêu cầu hỗ trợ học phí',
    perm: '',
    component: SchoolFeeSupportRequestList,
  },
  {
    path: '/schoolFeeSupport/create',
    name: 'Thêm mới yêu cầu hỗ trợ học phí',
    perm: '',
    component: SchoolFeeSupportForm,
  },
  {
    path: '/schoolFeeSupport/:id',
    name: 'Thông tin yêu cầu hỗ trợ học phí',
    perm: '',
    component: SchoolFeeSupportForm,
  },
  {
    path: "/documentSupport",
    name: "Yêu cầu hỗ trợ tài liệu",
    perm: "",
    component: DocumentSupportRequestList,
  },
  {
    path: "/documentSupport/create",
    name: "Thêm mới hỗ trợ tài liệu",
    perm: "",
    component: DocumentSupportForm,
  },
  {
    path: "/documentSupport/:id",
    name: "Cập nhật danh sách hỗ trợ tài liệu",
    perm: "",
    component: DocumentSupportForm,
  },
  {
    path: "/report",
    name: "Báo cáo",
    perm: "",
    component: Report,
  }
];
