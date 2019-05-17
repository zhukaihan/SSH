import { createStackNavigator } from 'react-navigation';
import ViewHousingPage from './ViewHousingPage';
import HousingSearchPage from './HousingSearchPage';

const HousingSearchStackNavigator = createStackNavigator(
	{
		HousingSearchPage: {
			screen: HousingSearchPage, 
			navigationOptions: {
				headerVisible: false
			}
		},
		ViewHousingPage: {
			screen: ViewHousingPage
		},
	},
	{
		initialRouteName: 'HousingSearchPage',
		headerMode: 'none',
		navigationOptions: {
		}
	}
);
export default HousingSearchStackNavigator;