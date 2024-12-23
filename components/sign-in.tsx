'use client'

import { useTransition } from 'react'
import { signInWithGoogle } from "@/app/actions/authentication"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  const [isPending, startTransition] = useTransition()

  const handleSignIn = () => {
    startTransition(async () => {
      await signInWithGoogle()
    })
  }

  return (
    <Button onClick={handleSignIn} disabled={isPending}>
      {isPending ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
    </Button>
  )
}

