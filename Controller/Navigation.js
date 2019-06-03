import { createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import LogInPage from './LogInPage';
import TabNavigator from './TabNavigator';
import CreateProfile1Page from './CreateProfile1Page';
import CreateProfile2Page from './CreateProfile2Page';
import CreateProfile3Page from './CreateProfile3Page';
import AddProfilePage from './AddProfilePage';
import HousingSearchPage from './HousingSearchPage';
import ViewHousingPage from './ViewHousingPage';
import RoomateSearchPage from './RoomateSearchPage';
import ProfilePage from './ProfilePage';
import PrivatePolicy from './PrivatePolicy';

const LogInStackNavigator = createStackNavigator(
  {
    LogInPage: {
			screen: LogInPage, 
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		PrivatePolicy:{
			screen: PrivatePolicy,
			navigationOptions:{
				gesturesEnabled: false,
			}
		},
		CreateProfile1Page:{
			screen: CreateProfile1Page, 
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		CreateProfile2Page:{
			screen: CreateProfile2Page, 
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		CreateProfile3Page:{
			screen: CreateProfile3Page, 
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		AddProfilePage:{
			screen: AddProfilePage, 
			navigationOptions: {
				gesturesEnabled: false
			}
		},
  },
	{
		//initialize initial screen to createProfilepage2g
		initialRouteName: 'LogInPage',
		headerMode: 'none',
  }
)

const MainNavigator = createSwitchNavigator(
  {
    LogInStackNavigator: {
			screen: LogInStackNavigator
		},
    TabNavigator: {
			screen: TabNavigator
		}
  },
  {
    initialRouteName: 'LogInStackNavigator',
  }
)

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;