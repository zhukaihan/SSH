import { createStackNavigator, createAppContainer} from 'react-navigation';
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
		},
	},
	{
		//initialize initial screen to createProfilepage2g
		initialRouteName: 'LogInPage',
		headerMode: 'none',
		navigationOptions: {
			headerVisible: false
		}
	}

);

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;