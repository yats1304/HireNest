'use client'

import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { job_service, useAppData } from '@/context/AppContext'
import { Application, Job } from '@/types'
import axios from 'axios'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle,
  DollarSign,
  MapPin,
  Users,
  Wifi,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import Link from 'next/link'

const JobPage = () => {
  const { user, isAuth, applyJob, applications, btnLoading } = useAppData()
  const { id } = useParams()
  const router = useRouter()

  const [applied, setApplied] = useState(false)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (applications && id) {
      applications.forEach((item: any) => {
        if (item.job_id.toString() === id) setApplied(true)
      })
    }
  }, [applications, job])

  const applyJobHandler = (id: number) => {
    applyJob(id)
  }

  async function fetchSingleJob() {
    try {
      const { data } = await axios.get(`${job_service}/api/job/${id}`)
      setJob(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSingleJob()
  }, [id])

  const [jobApplications, setJobApplications] = useState<Application[]>([])

  const token = Cookies.get('token')

  async function fetchJobApplications() {
    setLoading(true)
    try {
      const { data } = await axios.get(`${job_service}/api/job/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setJobApplications(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && job && user.user_id === job.posted_by_recruiter_id) {
      fetchJobApplications()
    }
  }, [user, job])

  const [filterStatus, setFilterStatus] = useState('All')

  const filterApplications =
    filterStatus === 'All'
      ? jobApplications
      : jobApplications.filter((app) => app.status === filterStatus)

  const [value, setValue] = useState('')

  const updateApplicationHandler = async (id: number) => {
    if (value === '') return toast.error('Please give valid value')

    try {
      const { data } = await axios.put(
        `${job_service}/api/job/application/update/${id}`,
        { status: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success(data.message)
      fetchJobApplications()
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  if (loading) return <Loading />

  return (
    <div className='min-h-screen bg-secondary/30'>
      {job && (
        <div className='max-w-5xl mx-auto px-4 py-8'>
          <Button variant={'ghost'} className='mb-6 gap-2' onClick={() => router.back()}>
            <ArrowLeft size={18} /> Back to jobs
          </Button>

          <Card className='overflow-hidden shadow-lg border-2 mb-6 '>
            <div className='bg-blue-600 p-8 border-b'>
              <div className='flex items-start justify-between gap-4 flex-wrap'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium 
                          ${
                            job.is_active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                          }`}
                    >
                      {job.is_active ? 'Open' : 'Closed'}
                    </span>
                    {job.work_location && (
                      <span className='flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white backdrop-blur-sm'>
                        <Wifi size={13} />
                        {job.work_location}
                      </span>
                    )}
                  </div>

                  <h1 className='text-3xl md:text-4xl font-bold mb-4 text-white'>{job.title}</h1>
                  <div className='flex items-center gap-2 text-base opacity-70 mb-2 text-white'>
                    <Building2 size={18} />
                    <span>{job.company_name || `Company Name`} </span>
                  </div>
                </div>

                {user && user.role === 'jobseeker' && (
                  <div className='shrink-0'>
                    {applied ? (
                      <div
                        className='flex items-center justify-center gap-2 text-green-600
                          font-medium text-sm bg-green-100 dark:bg-green-900/30 rounded-md px-3 py-2'
                      >
                        <CheckCircle size={15} />
                        Already Applied
                      </div>
                    ) : (
                      <>
                        {job.is_active !== false && (
                          <Button
                            disabled={btnLoading}
                            onClick={() => applyJobHandler(job.job_id)}
                            className='gap-2'
                          >
                            <Briefcase size={16} /> {btnLoading ? 'Applying..' : 'Easy Apply'}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className='p-8'>
              <div className='grid md:grid-cols-3 gap-6 mb-8'>
                <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                  <div
                    className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 
                  flex justify-center items-center shrink-0'
                  >
                    <MapPin size={20} className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xs opacity-70 font-medium mb-1'>Location</p>
                    <p className='font-semibold'>{job.location}</p>
                  </div>
                </div>

                <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                  <div
                    className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 
                  flex justify-center items-center shrink-0'
                  >
                    <DollarSign size={20} className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xs opacity-70 font-medium mb-1'>Salary</p>
                    <p className='font-semibold'>₹ {job.salary} P.A</p>
                  </div>
                </div>

                <div className='flex items-center gap-3 p-4 rounded-lg border bg-background'>
                  <div
                    className='h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 
                  flex justify-center items-center shrink-0'
                  >
                    <Users size={20} className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-xs opacity-70 font-medium mb-1'>Openings</p>
                    <p className='font-semibold'>
                      {Math.floor(job.openings)} {job.openings > 2 ? 'Positions' : 'Position'}
                    </p>
                  </div>
                </div>
              </div>

              {/* job description */}
              <div className='space-y-4'>
                <div className='text-2xl font-bold flex items-center gap-2'>
                  <Briefcase size={24} className='text-blue-600' />
                  Job Description
                </div>
                <div className='p-6 rounded-lg bg-secondary border'>
                  <p className='text-base leading-relaxed whitespace-pre-line'>{job.description}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {user && job && user.user_id === job.posted_by_recruiter_id && (
        <div className='w-[90%] md:w-2/3 container mx-auto mt-8 mb-8'>
          <div className='flex items-center justify-between mb-4 flex-wrap gap-3'>
            <h2 className='text-2xl font-bold'>All Applications</h2>
            <div className='flex items-center gap-2'>
              <label htmlFor='filter-status' className='text-sm font-medium'>
                Filter:
              </label>
              <select
                id='filter-status'
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className='p-2 border-2 border-gray-300 rounded-md bg-background'
              >
                <option value='All'>All Status</option>
                <option value='Submitted'>Submitted</option>
                <option value='Hired'>Hired</option>
                <option value='Rejected'>Rejected</option>
              </select>
            </div>
          </div>
          {jobApplications && jobApplications.length > 0 ? (
            <>
              <div className='space-y-4'>
                {filterApplications.map((e) => (
                  <div className='p-4 rounded-lg border-2 bg-background' key={e.applicant_id}>
                    <div className='flex items-center justify-between mb-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium 
                            ${
                              e.status === 'Hired'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                : e.status === 'Rejected'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                  : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                            }`}
                      >
                        {e.status}
                      </span>
                    </div>

                    <div className='flex gap-3 mb-3'>
                      <Link
                        target='_blank'
                        href={e.resume}
                        className='text-blue-500 hover:underline text-sm'
                      >
                        View Resume
                      </Link>

                      <Link
                        target='_blank'
                        href={`/account/${e.applicant_id}`}
                        className='text-blue-500 hover:underline text-sm'
                      >
                        View Profile
                      </Link>
                    </div>

                    {/* update status */}
                    <div className='flex gap-2 pt-2 border-t'>
                      <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className='flex-1 p-2 border-2 border-gray-300 rounded-md bg-background'
                      >
                        <option value=''>Update Status</option>
                        <option value='Submitted'>Submitted</option>
                        <option value='Hired'>Hired</option>
                        <option value='Rejected'>Rejected</option>
                      </select>
                      <Button
                        disabled={btnLoading}
                        onClick={() => updateApplicationHandler(e.application_id)}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {filterApplications.length === 0 && (
                <p className='text-center py-8 opacity-70'>
                  No application with status {filterStatus}
                </p>
              )}
            </>
          ) : (
            <>
              <p className='text-center py-8 opacity-70'>No application yet.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default JobPage
