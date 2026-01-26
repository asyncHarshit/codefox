import { requireAuth } from "@/module/auth/utils/auth-util"

const DashBoard = async() => {
    await requireAuth()
  return (
    <div>DashBoard</div>
  )
}

export default DashBoard