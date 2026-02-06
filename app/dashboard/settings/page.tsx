import RepositoryList from '@/module/settings/components/repositoryList'
import { ProfileForm } from '@/module/settings/components/use-update-form'
import React from 'react'

const settingPage = () => {
  return (
    <div>
      <div><ProfileForm/></div>
      <div>
        <RepositoryList/>
      </div>

    </div>
  )
}

export default settingPage