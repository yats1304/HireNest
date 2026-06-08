"use client"

import Loading from '@/components/loading';
import { CareerGuide, Hero, ResumeAnalyzer } from '@/components/pages';
import { useAppData } from '@/context/AppContext';
import React from 'react'

const Homes = () => {
  const { loading } = useAppData()
  if (loading) return <Loading/>
  return (
    <div>
      <Hero/>
      <CareerGuide/>
      <ResumeAnalyzer/>
    </div>
  )
}

export default Homes;