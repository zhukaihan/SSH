import { createStackNavigator } from 'react-navigation';
import HousingListingPage from './HousingListingPage';
import EditHousingPage from './EditHousingPage';
import IndividualUserSearch from '../View/IndividualUserSearch';

const HousingListingStackNavigator = createStackNavigator(
	{
		HousingListingPage: {
			screen: HousingListingPage, 
			navigationOptions: {
				headerVisible: false
			}
		},
		EditHousingPage: {
			screen: EditHousingPage
		},
		IndividualUserSearch: {
			screen: IndividualUserSearch
		}
	},
	{
		initialRouteName: 'HousingListingPage',
		headerMode: 'none',
		navigationOptions: {
		}
	}
);
export default HousingListingStackNavigator;