import { createStackNavigator, createAppContainer} from 'react-navigation';
import LogInPage from './LogInPage';
import ProfilePage from './ProfilePage';


const MainNavigator = createStackNavigator(
	{
	LogInPage: {screen: LogInPage},
	ProfilePage: {screen: ProfilePage,
					navigationOptions:{
						title: 'Profile Page',
						headerLeft: null
					}}
	},


);

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;