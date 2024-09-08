"use client"

import Settings from '@/interfaces/Settings';
import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Input from "@/components/Input"

export default function Page() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    apiGet("user-settings/")
    .then(data => {
      setSettings({
        emailNotifications: data.email_notification,
        dmNotifications: data.dm_notifications,
        forumAnswersNotifications: data.forum_answers_notifications,
        privateCommunityActivityNotifications: data.private_community_activity_notifications,
        theme: data.theme,
        fontSize: data.font_size,
        language: data.language,
        blockedUsers: data.blocked_users
      });
      setLoading(false)
      console.log(data)
    })
  }, [])

  if (loading || settings === null) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full h-full [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:justify-between [&_label]:text-lg [&_label]:ml-4 [&>div]:w-fit">
      <div>
        <Switch/>
        <Label >Notificações por email</Label>
      </div>
      <div>
        <Switch/>
        <Label >Notificações de DM&apos;s</Label>
      </div>
      <div>
        <Switch/>
        <Label >Notificações de Respostas em Fóruns</Label>
      </div>
      <div>
        <Switch/>
        <Label >Notificações de Atividades em Comunidades Privadas</Label>
      </div>
      <div>
        <Label >Tema</Label>
      </div>
      <div>
        <Input type="number"/>
        <Label >Tamanho da fonte</Label>
      </div>
      <div>
        <Label >Língua</Label>
      </div>
      <div>
        <h2>Usuários bloqueados</h2>
      </div>
    </div>
  )
}
