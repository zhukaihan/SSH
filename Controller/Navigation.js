import { createStackNavigator, createAppContainer} from 'react-navigation';
import LogInPage from './LogInPage';
import TabNavigator from './TabNavigator';
import RoomateSearchPage from './RoomateSearchPage';
import ProfilePage from './ProfilePage';

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
		}
	},
	{
		initialRouteName: 'LogInPage',
		headerMode: 'none',
		navigationOptions: {
			headerVisible: false
		}
	}

);

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;