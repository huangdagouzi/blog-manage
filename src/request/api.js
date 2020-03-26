import { get, post, del, put, getImage } from './http'
//登陆
export const login = (p) => post('/users/login', p);
//博客管理
export const getBlogsList = (p) => get(`/articles/list?${p}`);//查询博客列表
export const addBlog = (p) => post('/articles/add', p);
export const delBlog = (p) => get(`/articles/del?${p}`);//删除新闻
export const getBlogDetail = (p) => get(`/articles?${p}`);//查询新闻详情
export const updateBlog = (p) => post('/articles/update', p);
//图片管理
export const getBanner = (p) => get(`/file/bannerList`);//查询博客列表
export const getImg = (p) => get(`/file/getImage/${p}`);//查询博客列表
export const delBanner = (p) => get(`/file/delBanner?${p}`);//删除banner
