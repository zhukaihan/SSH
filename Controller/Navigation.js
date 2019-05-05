import { createStackNavigator, createAppContainer} from 'react-navigation';
import LogInPage from './LogInPage';
import TabNavigator from './TabNavigator';


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