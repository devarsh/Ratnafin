import { useState, useRef, forwardRef, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import { ListingGrid } from "pages_los/common/listingGrid";
import { DetailsTabView } from "./detailsTabView";
import { ActionTypes } from "components/dataTable";
import { ClearCacheProvider } from "cache";

const actions: ActionTypes[] = [
  {
    actionName: "completeView",
    actionLabel: "360 View",
    multiple: false,
    rowDoubleClick: true,
  },
];

const Transition = forwardRef(function Transition(props, ref) {
  //@ts-ignore
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Lead = () => {
  let gridCode = "TRN/003";
  const [action, setAction] = useState<null | any>(null);
  const isDataEditedRef = useRef(false);
  const [gridRefresh, setGridRefresh] = useState(false);

  const handleDialogClose = () => {
    setAction(null);
    if (isDataEditedRef.current) {
      setGridRefresh(true);
      isDataEditedRef.current = false;
    }
  };

  return (
    <Fragment>
      <ListingGrid
        gridCode={gridCode}
        actions={actions}
        setAction={setAction}
        gridRefresh={gridRefresh}
        setGridRefresh={setGridRefresh}
      />
      <Dialog
        fullScreen
        open={action !== null}
        //@ts-ignore
        TransitionComponent={Transition}
        key={action?.rows[0].id}
      >
        <ClearCacheProvider>
          <DetailsTabView
            key={action?.rows[0].id}
            moduleType="lead"
            productGridData={action?.rows[0]}
            refID={action?.rows[0].id}
            isDataChangedRef={isDataEditedRef}
            handleDialogClose={handleDialogClose}
          />
        </ClearCacheProvider>
      </Dialog>
    </Fragment>
  );
};
