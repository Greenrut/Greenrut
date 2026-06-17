import { useEffect, useState } from 'react'
import { AccountPageShell } from './account/shared.jsx'
import { accountRequest } from '../lib/accountApi.js'

export function AccountInboxPage({ pathname }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadInbox() {
      try {
        setLoading(true)
        const response = await accountRequest('/account/inbox')
        if (!cancelled) {
          setMessages(response.data || [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.message || 'Failed to load inbox')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInbox()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AccountPageShell pathname={pathname} title="INBOX" breadcrumb="Home  /  inbox">
      <div className="account-page-toolbar">
        <h2>Inbox Messages</h2>
      </div>
      {loading ? <p>Loading inbox...</p> : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {messages.length ? (
        <div className="account-inbox-list">
          {messages.map((message, index) => (
            <article key={message._id || index} className="account-inbox-item">
              <h3>{message.subject || 'Message'}</h3>
              <p>{message.message}</p>
              <small>{message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}</small>
            </article>
          ))}
        </div>
      ) : loading ? null : (
        <div className="account-empty-state">
          <div className="account-empty-state__icon">
            <span className="account-empty-state__flap" />
          </div>
          <h3>You don't have any messages</h3>
          <p>Here you will be able to see all the messages that we send you.</p>
          <p>Stay tuned</p>
        </div>
      )}
    </AccountPageShell>
  )
}
