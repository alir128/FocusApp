 import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import { List, TouchableRipple, Divider } from 'react-native-paper';

import Edit from './DialogNewEdit'
import moment from 'moment'
export default class FlatListBasics extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          pressedItem: {}
        };
      }
    _keyExtractor = (item, index) => item._id;
    _handler = (item_id, task) => {this.props.edit(item_id, task) && this.setState({visible:false, pressedItem:{}})};
    _closeEditDialog = () => {this.setState({visible:false, pressedItem: {}})}
  render() { 
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data }
          onRefresh={() => this.props.onRefresh()} 
          refreshing={ this.props.isFetch }
          ItemSeparatorComponent={Divider}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) =>
            <TouchableRipple
                style={styles.ripple}
                onPress={() => this.setState({ visible: true, pressedItem: item})}
                rippleColor="rgba(0, 0, 0, .32)"
            >
                <List.Item
                    left={props => <TouchableOpacity onPress={() => this.props.delete(item._id)}>
                    <List.Icon  {...props} icon="cancel" />
                </TouchableOpacity>}
                    title={item.task}
                    description={moment(item.deadLine).format('llll')}
                    right={props =><List.Icon {...props} icon="event" />}
                />
            </TouchableRipple>
          
          }
        />
        <Edit title="Edit" inputMessage="Task" visible={this.state.visible} close={this._closeEditDialog} item={this.state.pressedItem} handler={this._handler}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  ripple: {
    flex: 1,
  },
})