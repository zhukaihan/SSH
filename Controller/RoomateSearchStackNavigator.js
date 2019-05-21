import { createStackNavigator } from 'react-navigation';
import RoomateSearchPage from './RoomateSearchPage';
import ProfilePage from './ProfilePage';

const RoomateSearchStackNavigator = createStackNavigator(
	{
		RoomateSearchPage: {
			screen: RoomateSearchPage, 
			navigationOptions: {
				headerVisible: false
			}
		},
		ProfilePage: {
			screen: ProfilePage
		},
	},
	{
		initialRouteName: 'RoomateSearchPage',
		headerMode: 'none',
		navigationOptions: {
		}
	}
);
export default RoomateSearchStackNavigator;