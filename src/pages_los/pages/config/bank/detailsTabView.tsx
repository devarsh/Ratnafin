import { useRef, Fragment, useContext, useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { Tab } from "components/styledComponent/tab";
import { Tabs } from "components/styledComponent/tabs";
import { ClearCacheContext } from "cache";
import {
  GridCRUD,
  CRUDContextProvider,
  useStyles,
} from "pages_los/common/crud2";
import { LOSSDK } from "registry/fns/los";
import { queryClient, ClearCacheProvider } from "cache";

const TabPanel = ({ value, index, children }) => {
  return Number(value) === Number(index) ? children : null;
};

const bankCrudAPIArgs = (moduleType, productType, refID, productCode) => ({
  context: {
    moduleType,
    productType,
    refID,
    productCode,
  },
  insertFormData: {
    fn: LOSSDK.insertBankData,
    args: { moduleType, productType, refID },
  },
  checkFormDataExist: {
    fn: LOSSDK.checkFormDataExist,
    args: { moduleType, productType, refID },
  },
  deleteFormData: {
    fn: LOSSDK.deleteBankData,
    args: { moduleType, productType, refID },
  },
  updateFormData: {
    fn: LOSSDK.updateBankData,
    args: { moduleType, productType, refID },
  },
  getFormData: {
    fn: LOSSDK.getBankData,
    args: { moduleType, productType, refID },
  },
  getGridFormData: {
    fn: LOSSDK.getGridBankData,
    args: { moduleType, productType, refID },
  },
  getFormMetaData: {
    fn: LOSSDK.getFormMetaData,
    args: { moduleType, productType, refID },
  },
  getGridFormMetaData: {
    fn: LOSSDK.getGridFormMetaData,
    args: { moduleType, productType, refID },
  },
});

export const DetailsTabView = () => {
  const isDataEditedRef = useRef(false);
  const removeCache = useContext(ClearCacheContext);
  const [currentTab, setCurrentTab] = useState(0);
  const handleChangeTab = (_, currentTab) => {
    setCurrentTab(currentTab);
  };
  const classes = useStyles();
  //Remove all the cached queries of all tabs when this component unmounts
  useEffect(() => {
    return () => {
      let entries = removeCache?.getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
    };
  }, [removeCache]);

  return (
    <Fragment>
      <Tabs value={currentTab} onChange={handleChangeTab}>
        <Tab label="SME" id="0" />
        <Tab label="Infra" id="1" />
        <Tab label="Retail" id="2" />
        <Tab label="Unsecured" id="3" />
      </Tabs>
      <Box py={2} className={classes.tabPanel}>
        <TabPanel value={currentTab} index="0" key={0}>
          <CRUDContextProvider
            {...bankCrudAPIArgs("config/bank", "sme", null, "12000002")}
          >
            <GridCRUD isDataChangedRef={isDataEditedRef} />
          </CRUDContextProvider>
        </TabPanel>
        <TabPanel value={currentTab} index="1" key={1}>
          <CRUDContextProvider
            {...bankCrudAPIArgs("config/bank", "infra", null, "12000003")}
          >
            <GridCRUD isDataChangedRef={isDataEditedRef} />
          </CRUDContextProvider>
        </TabPanel>
        <TabPanel value={currentTab} index="2" key={2}>
          <CRUDContextProvider
            {...bankCrudAPIArgs("config/bank", "retail", null, "12000001")}
          >
            <GridCRUD isDataChangedRef={isDataEditedRef} />
          </CRUDContextProvider>
        </TabPanel>
        <TabPanel value={currentTab} index="3" key={3}>
          <CRUDContextProvider
            {...bankCrudAPIArgs("config/bank", "unsecured", null, "12000004")}
          >
            <GridCRUD isDataChangedRef={isDataEditedRef} />
          </CRUDContextProvider>
        </TabPanel>
      </Box>
    </Fragment>
  );
};

export const DetailsTabViewBank = () => (
  <ClearCacheProvider>
    <DetailsTabView />
  </ClearCacheProvider>
);
