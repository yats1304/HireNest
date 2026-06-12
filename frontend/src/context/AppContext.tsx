'use client'

import { AppContextType, Application, AppProviderProps, User } from '@/types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Cookies from 'js-cookie'
import axios from 'axios'
import { user_service } from '@/config/services'

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)

  const token = Cookies.get('token')

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${user_service}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(data)
      setIsAuth(true)
    } catch (error) {
      console.log(error)
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfilePicture(formData: any) {
    setLoading(true)
    try {
      const { data } = await axios.put(`${user_service}/api/user/update/pic`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(data.message)
      fetchUser()
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateResume(formData: any) {
    setLoading(true)
    try {
      const { data } = await axios.put(`${user_service}/api/user/update/resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(data.message)
      fetchUser()
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateUser(name: string, phoneNumber: string, bio: string) {
    setBtnLoading(true)
    try {
      const { data } = await axios.put(
        `${user_service}/api/user/update/profile`,
        {
          name,
          phoneNumber,
          bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(data.message)
      fetchUser()
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setBtnLoading(false)
    }
  }

  async function logoutUser() {
    Cookies.set('token', '')
    setUser(null)
    setIsAuth(false)
    toast.success('Logged out successfully')
  }

  async function addSkill(skill: string, setSkill: React.Dispatch<React.SetStateAction<string>>) {
    setBtnLoading(true)
    try {
      const { data } = await axios.post(
        `${user_service}/api/user/skill/add`,
        { skillName: skill },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(data.message)
      setSkill('')
      fetchUser()
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setBtnLoading(false)
    }
  }

  async function removeSkill(skill: string) {
    try {
      const { data } = await axios.put(
        `${user_service}/api/user/skill/delete`,
        { skillName: skill },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(data.message)
      fetchUser()
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  async function applyJob(job_id: number) {
    setBtnLoading(true)
    try {
      const { data } = await axios.post(
        `${user_service}/api/user/apply/job`,
        { job_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(data.message)
      await fetchApplication()
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setBtnLoading(false)
    }
  }

  const [applications, setApplications] = useState<Application[]>([])

  async function fetchApplication() {
    try {
      const { data } = await axios.get(`${user_service}/api/user/applications/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setApplications(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchApplication()
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        btnLoading,
        setUser,
        isAuth,
        setIsAuth,
        setLoading,
        logoutUser,
        updateProfilePicture,
        updateResume,
        updateUser,
        addSkill,
        removeSkill,
        applyJob,
        applications,
        fetchApplication,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  )
}

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppData must be used within AppProvider')
  }
  return context
}
