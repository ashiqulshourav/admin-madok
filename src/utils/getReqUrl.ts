

/* !- 列表内容请求Url获取 */
export const getQueryUrl = () => {
  const router = useRouter()
  return (router.currentRoute.value.meta.childResourceList as any[])?.find(item => {
    return item.enName === 'QUERY'
  })?.routerPath
}
