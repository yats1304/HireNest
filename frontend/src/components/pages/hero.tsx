import { ArrowRight, Briefcase, Search, TrendingUp } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className='relative overflow-hidden bg-secondary min-h-[90vh] flex items-center'>

      {/* Background decorative blobs */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-16 left-8 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl' />
        <div className='absolute bottom-16 right-8 w-96 h-96 bg-red-400 opacity-10 rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-blue-300 opacity-5 rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-6 lg:px-10 py-16 md:py-24 relative z-10'>
        <div className='flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16'>

          {/*  Left content column */}
          <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-7'>

            {/* Badge */}
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-background/60 backdrop-blur-sm shadow-sm'>
              <TrendingUp size={15} className='text-blue-600 shrink-0' />
              <span className='text-sm font-semibold tracking-wide'>#1 Job Platform in India</span>
            </div>

            {/* Heading */}
            <h1 className='text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.15] tracking-tight'>
              Find Your Dream Job at{' '}
              <span className='whitespace-nowrap'>
                Hire<span className='text-red-500'>Nest</span>
              </span>
            </h1>

            {/* Description */}
            <p className='text-base md:text-lg leading-relaxed opacity-70 max-w-lg'>
              Connect with top employers and discover opportunities that match your
              skills. Whether you&apos;re a job seeker or recruiter, we&apos;ve got you covered
              with powerful tools and a seamless experience.
            </p>

            {/* Stats row */}
            <div className='flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 py-2 w-full'>
              {[
                { value: '10k+', label: 'Active Jobs' },
                { value: '5k+',  label: 'Companies' },
                { value: '50k+', label: 'Job Seekers' },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  <div className='text-center md:text-left'>
                    <p className='text-3xl font-bold text-blue-600 leading-none'>{stat.value}</p>
                    <p className='text-sm opacity-60 mt-1'>{stat.label}</p>
                  </div>
                  {i < 2 && (
                    <div className='hidden md:block self-stretch w-px bg-foreground/10 mx-1' />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link href='/jobs'>
                <Button
                  size='lg'
                  className='text-base px-8 h-12 gap-2 group transition-all w-full sm:w-auto'
                >
                  <Search size={18} />
                  Browse Jobs
                  <ArrowRight
                    size={18}
                    className='group-hover:translate-x-1 transition-transform duration-200'
                  />
                </Button>
              </Link>
              <Link href='/about'>
                <Button
                  variant='outline'
                  size='lg'
                  className='text-base px-8 h-12 gap-2 w-full sm:w-auto'
                >
                  <Briefcase size={18} />
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className='flex flex-wrap justify-center md:justify-start items-center gap-x-3 gap-y-2 text-sm opacity-55 pt-1'>
              <span>✔ Free to use</span>
              <span className='text-foreground/30'>•</span>
              <span>✔ Verified employers</span>
              <span className='text-foreground/30'>•</span>
              <span>✔ Secure Platform</span>
            </div>
          </div>

          {/* Right image column */}
          <div className='flex-1 relative group w-full max-w-lg mx-auto md:mx-0'>
            {/* Glow ring behind image */}
            <div className='absolute -inset-4 bg-blue-400 opacity-20 blur-2xl rounded-3xl transition-opacity duration-500 group-hover:opacity-30' />

            {/* Image card */}
            <div className='relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background/80 aspect-4/3'>
              <img
                src='/about.webp'
                alt='HireNest platform preview'
                className='w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105'
              />
              {/* Subtle overlay gradient */}
              <div className='absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none' />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero