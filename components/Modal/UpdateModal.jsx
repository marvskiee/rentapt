import React from "react";

import ModalLayout from "../Layout/ModalLayout";
import TenantLayout from "../Layout/TenantLayout";

const UpdateModal = ({ cancel, unit, reload }) => {
  return (
    <ModalLayout image={true}>
      <TenantLayout
        modify={true}
        cancel={cancel}
        old={unit[0]}
        reload={reload}
      />
    </ModalLayout>
  );
};

export default UpdateModal;
