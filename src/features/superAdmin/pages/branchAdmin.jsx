import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SuperAdminTableHeader from '../components/superAdminTableHeader'
import BranchAdminTable from '../components/branchAdmin/branchAdminTable'
import SuperAdminCard from '../components/superAdminCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { branchAdminData } from "../data/branch_admin/branchAdminTable.js"
import { branchAdminHeader } from "../data/branch_admin/branchAdminHeader.js"

const BranchAdmin = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const filteredData = {
    ...branchAdminData,
    data: branchAdminData.data.filter((b) => {
      const fullName = `${b.first_name} ${b.last_name}`.toLowerCase()
      const q = search.toLowerCase()
      return fullName.includes(q) || b.employee_id?.toLowerCase().includes(q)
    }),
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SuperAdminCard title="Total Users" value={branchAdminData.total_user} />
        <SuperAdminCard title="Active Users" value={branchAdminData.active_user} />
      </div>

      <SuperAdminTableHeader
        onSearch={setSearch}
        createButton={
          <Button
            className="gap-2 whitespace-nowrap"
            onClick={() => navigate('/super-admin/branch-admin/create')}
          >
            <Plus size={16} />
            Create Branch Admin
          </Button>
        }
      />

      <BranchAdminTable data={filteredData} headers={branchAdminHeader} />
    </div>
  )
}

export default BranchAdmin
