'use client'

import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { job_service, useAppData } from '@/context/AppContext'
import { Job } from '@/types'
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
    </div>
  )
}

export default JobPage
