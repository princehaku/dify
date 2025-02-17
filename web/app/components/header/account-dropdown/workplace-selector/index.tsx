import { Fragment } from 'react'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import { Menu, Transition } from '@headlessui/react'
import s from './index.module.css'
import cn from '@/utils/classnames'
import { switchWorkspace } from '@/service/common'
import { useWorkspacesContext } from '@/context/workspace-context'
import { ChevronRight } from '@/app/components/base/icons/src/vender/line/arrows'
import { Check } from '@/app/components/base/icons/src/vender/line/general'
import { ToastContext } from '@/app/components/base/toast'

const itemClassName = `
  flex items-center px-3 py-2 h-9 cursor-pointer rounded-lg
`
const itemIconClassName = `
  shrink-0 mr-2 flex items-center justify-center w-6 h-6 bg-[#EFF4FF] rounded-md text-xs font-medium text-text-accent
`
const itemNameClassName = `
  grow mr-2 text-sm text-text-secondary text-left
`
const itemCheckClassName = `
  shrink-0 w-4 h-4 text-text-accent
`

const WorkplaceSelector = () => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const { workspaces } = useWorkspacesContext()
  const currentWorkspace = workspaces.find(v => v.current)

  const handleSwitchWorkspace = async (tenant_id: string) => {
    try {
      if (currentWorkspace?.id === tenant_id)
        return
      await switchWorkspace({ url: '/workspaces/switch', body: { tenant_id } })
      notify({ type: 'success', message: t('common.actionMsg.modifiedSuccessfully') })
      location.assign(`${location.origin}`)
    }
    catch (e) {
      notify({ type: 'error', message: t('common.provider.saveFailed') })
    }
  }

  return (
    <Menu as="div" className="relative w-full h-full">
      {
        ({ open }) => (
          <>
            <Menu.Button className={cn(itemClassName,
              `
                w-full group hover:bg-state-base-hover pl-3 pr-2
              `,
              open && 'bg-state-base-hover',
            )}>
              <div className={itemIconClassName}>{currentWorkspace?.name[0].toLocaleUpperCase()}</div>
              <div className={`${itemNameClassName} truncate px-1`}>{currentWorkspace?.name}</div>
              <ChevronRight className='shrink-0 size-[14px] text-text-tertiary' />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                className={cn(
                  `
                    absolute top-[1px] w-[216px] max-h-[70vh] overflow-y-scroll z-10 bg-components-panel-bg-blur backdrop-blur-[5px] border-[0.5px] border-components-panel-border
                    divide-y divide-divider-subtle origin-top-right rounded-xl focus:outline-none
                  `,
                  s.popup,
                )}
              >
                <div className="px-1 py-1">
                  {
                    workspaces.map(workspace => (
                      <Menu.Item key={workspace.id}>
                        {({ active }) => <div className={cn(itemClassName,
                          active && 'bg-state-base-hover',
                        )} key={workspace.id} onClick={() => handleSwitchWorkspace(workspace.id)}>
                          <div className={itemIconClassName}>{workspace.name[0].toLocaleUpperCase()}</div>
                          <div className={itemNameClassName}>{workspace.name}</div>
                          {workspace.current && <Check className={itemCheckClassName} />}
                        </div>}

                      </Menu.Item>
                    ))
                  }
                </div>
              </Menu.Items>
            </Transition>
          </>
        )
      }
    </Menu>
  )
}

export default WorkplaceSelector
