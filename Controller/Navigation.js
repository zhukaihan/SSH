import { createStackNavigator, createAppContainer} from 'react-navigation';
import LogInPage from './LogInPage';
import TabNavigator from './TabNavigator';
import RoomateSearchPage from './RoomateSearchPage';
import ProfilePage from './ProfilePage';
import CreateProfile1Page from './CreateProfile1Page';
import CreateProfile2Page from './CreateProfile2Page';
import CreateProfile3Page from './CreateProfile3Page';
import AddProfilePage from './AddProfilePage';

const MainNavigator = createStackNavigator(
	{
		LogInPage: {
			screen: LogInPage
		},
		TabNavigator: {
			screen: TabNavigator, 
			navigationOptions: {
				gesturesEnabled: false
			}
		},
		RoomateSearchPage:{
			screen: RoomateSearchPage,
		},
		ProfilePage:{
			screen: ProfilePage,
		},
		CreateProfile1Page:{
			screen: CreateProfile1Page,
		},
		CreateProfile2Page:{
			screen: CreateProfile2Page,
		},
		CreateProfile3Page:{
			screen: CreateProfile3Page,
		},
		AddProfilePage:{
			screen: AddProfilePage,
		}
	},
	{
		//initialize initial screen to createProfilepage2g
		initialRouteName: 'LogInPage',
		initialRouteName: 'CreateProfile3Page',
		headerMode: 'none',
		navigationOptions: {
			headerVisible: false
		}
	}

);

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;