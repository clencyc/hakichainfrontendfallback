import { Outlet } from 'react-router-dom';
import { RoleBasedSettingsLayout } from '../../components/settings/RoleBasedSettingsLayout';

const SettingsIndex = () => (
  <RoleBasedSettingsLayout>
    <Outlet />
  </RoleBasedSettingsLayout>
);

export default SettingsIndex; 