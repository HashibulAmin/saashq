"use client"

import DeleteOrders from "../DeleteOrders"
import SendData from "../SendData"
import SyncConfig from "../SyncConfig"
import SyncOrders from "../SyncOrders"
import SaasHQLink from "./SaasHQLink"

const Grid = ({ config }: any) => {
  const { branchId, departmentId, ebarimtConfig } = config || {}

  return (
    <>
      <div className="my-5 grid w-full grid-cols-3 gap-x-2 gap-y-3">
        <SyncConfig configType="config">Resync Config</SyncConfig>
        <SyncConfig configType="products">Resync Products</SyncConfig>
        <SyncConfig configType="slots">Resync slots</SyncConfig>
        <SyncOrders />
        <DeleteOrders />

        {!!ebarimtConfig && <SendData {...(ebarimtConfig || {})} />}
        {!!branchId && !!departmentId && (
          <>
            <SaasHQLink
              href={`/inventories/safe-remainders?branchId=${branchId}&departmentId=${departmentId}`}
            >
              Safe Remainder
            </SaasHQLink>
            <SaasHQLink
              href={`/inventories/remainders?branchId=${branchId}&departmentId=${departmentId}`}
            >
              Live Remainder
            </SaasHQLink>
            <SaasHQLink
              href={`/processes/performanceList?inBranchId=${branchId}&inDepartmentId=${departmentId}&outBranchId=${branchId}&outDepartmentId=${departmentId}`}
            >
              Performances
            </SaasHQLink>
          </>
        )}
      </div>
    </>
  )
}

export default Grid
