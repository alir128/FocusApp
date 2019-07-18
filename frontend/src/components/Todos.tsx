import React from 'react';
import { StyleSheet } from 'react-native';
import TodoInput from './InputBar';
import tabBarIcon from '../tabBarIcon';
import { LinearGradient } from 'expo-linear-gradient';
import { Provider as PaperProvider, Snackbar } from 'react-native-paper';
import AppBar from './AppBar'
import Todolist from './Todolist'
import API from '../api'


export default class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [
          ],
          isFetching: false,
          visible: false,
          visible1: false,
          message:''
        };
      }

      handler = (text) => {
        let data = {
            todo: text,
            username: "alir128",
            // deadLine: "2019-07-21T02:01:00.000Z"
        }

        return API.post('addTodo', data)
                 .then(res => {
                    // console.log(res.data)
                    this.setState(state => {
                        const data= [...state.data, res.data];
                        return {
                            data
                        };
                    });
                 })
      };

      componentDidMount() {
        API.get(`todo/all/alir128`)
          .then(res => {
            const notCompleteTodos = res.data;
            const newData = notCompleteTodos
                .filter(todo => !todo.isItDone);
                // .map(notcomp => ({ key: notcomp.todo}));
            this.setState(state => {
                return{
                    data: newData,
                    isFetching: false
                }
            })
          })
      }

    deleteHandler = (item_id) => {
        console.log(item_id)
        API.delete('todo/delete/'+item_id)
            .then(res => {
                
                this.setState(state => ({ visible: !state.visible, message: 'Deleted successfully' }), this.onRefresh())
            })
        
    }

    editHandler = (item_id, todo) => {
        let data = {
            todo: todo.text,
            username: "alir128",
            deadLine: todo.date
        }
        // console.log(text)

        return API.put('todo/edit/'+item_id, data)
                 .then(res => {
                    // console.log(res.data)
                    this.onRefresh();
                    this.setState(state => ({ visible: !state.visible, message: 'Edited successfully' }))
                 })

    }

    onRefresh = () => {
        this.setState({ isFetching: true }, () => { this.refreshTodos() });
     }

     refreshTodos = () => {   
        API.get(`todo/all/alir128`)
        .then(res => {
          const notCompleteTodos = res.data;
          const newData = notCompleteTodos
              .filter(todo => !todo.isItDone);
            //   .map(notcomp => ({ key: notcomp.todo}));
          this.setState(state => {
              return{
                  data: newData,
                  isFetching: false
              }
          })
        })

    }
    
    static navigationOptions = {
        tabBarIcon: tabBarIcon('md-list-box'),
      };
    render() {
        const { navigate } = this.props.navigation;

        return (
            <PaperProvider>
                <AppBar title="Daily Reminders" />
                <TodoInput label="To Do" placeholder="Enter new To Do" handler={this.handler} />
                <LinearGradient style={styles.container} colors={['#4c669f', '#3b5998', '#192f6a']}>

                <Todolist data={this.state.data}  onRefresh={this.onRefresh} isFetch={this.state.isFetching} delete={this.deleteHandler}  edit={this.editHandler}/>
                
                </LinearGradient>
                <Snackbar
                    visible={this.state.visible}
                    onDismiss={() => this.setState({ visible: false, message: '' })}
                    action={{
                        label: 'Dismiss',
                        onPress: () => {
                            this.setState({ visible: false, message: '' })
                        },
                    }}
                    duration={Snackbar.DURATION_SHORT}
                    >
                    {this.state.message}
                </Snackbar>
                
            </PaperProvider>        
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // justifyContent: 'center',
        // alignItems: 'center',
        flex: 1,
        padding: 8,
    },
    text: {
        fontSize: 36,
        // textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
});