import React from 'react';
import { EuiPageContent, EuiSuperDatePicker } from '@elastic/eui';

export class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      prevState: '',
      value: '',
      query: '',
      selected: '',
      recentlyUsedRanges: [],
      isLoading: false,
      start: 'now-30m',
      end: 'now',
      pageIndex: 0,
      pageSize: 5,
      showPerPageOptions: true,
      savedObjects: {},
      options: [],
      selectedOptions: [],
    };
  }

  // onTimeChange = ({ start, end }) => {
  //   this.setState(prevState => {
  //     const recentlyUsedRanges = prevState.recentlyUsedRanges.filter(recentlyUsedRange => {
  //       const isDuplicate = recentlyUsedRange.start === start && recentlyUsedRange.end === end;
  //       return !isDuplicate;
  //     });
  //     recentlyUsedRanges.unshift({ start, end });
  //     return {
  //       start,
  //       end,
  //       recentlyUsedRanges:
  //         recentlyUsedRanges.length > 10 ? recentlyUsedRanges.slice(0, 9) : recentlyUsedRanges,
  //       isLoading: true,
  //     };
  //   }, this.startLoading);
  // };

  // onRefresh = ({ start, end, refreshInterval }) => {
  //   return new Promise(resolve => {
  //     setTimeout(resolve, 100);
  //   }).then(() => {
  //     console.log(start, end, refreshInterval);
  //   });
  // };

  // startLoading = () => {
  //   setTimeout(this.stopLoading, 1000);
  // };

  // stopLoading = () => {
  //   this.setState({ isLoading: false });
  // };

  // onRefreshChange = ({ isPaused, refreshInterval }) => {
  //   this.setState({
  //     isPaused,
  //     refreshInterval,
  //   });
  // };

  // onChange = e => {
  //   this.setState({
  //     value: e.target.value,
  //     query: e.target.value,
  //   });
  // };
  render() {
    return (
      <EuiSuperDatePicker
        onTimeChange={this.props.onTimeChange}
        showUpdateButton={false}
        style={{ margingTop: '50px' }}
      />
    );
  }
}
