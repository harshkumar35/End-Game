"use client"

import type React from "react"
import { motion } from "framer-motion"
import { UserRound, GavelIcon } from "lucide-react"

interface RoleSelectorProps {
  selectedRole: string
  onRoleChange: (role: string) => void
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 my-6">
      <RoleCard
        title="Client"
        description="Looking for legal help"
        icon={<UserRound className="h-8 w-8" />}
        isSelected={selectedRole === "client"}
        onClick={() => onRoleChange("client")}
      />
      <RoleCard
        title="Lawyer"
        description="Offering legal services"
        icon={<GavelIcon className="h-8 w-8" />}
        isSelected={selectedRole === "lawyer"}
        onClick={() => onRoleChange("lawyer")}
      />
    </div>
  )
}

interface RoleCardProps {
  title: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

function RoleCard({ title, description, icon, isSelected, onClick }: RoleCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl p-4 ${
        isSelected
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800"
          : "bg-card border-border hover:border-blue-200 dark:hover:border-blue-800"
      } border transition-all duration-200 overflow-hidden`}
    >
      {isSelected && (
        <motion.div
          layoutId="highlight"
          className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-500/20 dark:to-indigo-500/20"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className="relative z-10">
        <div
          className={`p-2 w-fit rounded-full mb-3 ${
            isSelected
              ? "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-600 dark:text-blue-400"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <h3
          className={`font-semibold text-lg mb-1 ${
            isSelected ? "text-blue-700 dark:text-blue-400" : "text-foreground"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}
