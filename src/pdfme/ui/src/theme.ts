import type { ThemeConfig } from 'antd';

export const defaultTheme: ThemeConfig = {
  token: {
    colorPrimary: '#38a0ff',
    overlayToolbarBg: 'rgba(15, 23, 42, 0.9)',
    overlayBadgeBg: 'rgba(15, 23, 42, 0.85)',
    overlayMetricBg: 'rgba(15, 23, 42, 0.9)',
  },
  components: {
    Form: {
      fontSize: 12,
      margin: 8,
      marginLG: 12,
      marginXS: 4,
      padding: 8,
      paddingLG: 12,
      paddingXS: 4,
      itemMarginBottom: 4,
      verticalLabelPadding: '0 0 2px',
    },
  },
};

export const sisadTheme: ThemeConfig = {
  token: {
    colorPrimary: '#7500b9',
    colorInfo: '#1976d2',
    colorSuccess: '#2e7d32',
    colorWarning: '#ed6c02',
    colorError: '#d32f2f',
    colorBgLayout: '#f7f7fb',
    colorBgContainer: '#ffffff',
    colorBorder: '#d9d9e8',
    borderRadius: 10,
    fontFamily: "'Open Sans', sans-serif",
    overlayToolbarBg: 'rgba(15, 23, 42, 0.9)',
    overlayBadgeBg: 'rgba(15, 23, 42, 0.85)',
    overlayMetricBg: 'rgba(15, 23, 42, 0.9)',
  },
  components: {
    Button: {
      borderRadius: 10,
      defaultBorderColor: '#bfc3db',
      defaultColor: '#334155',
    },
    Input: {
      borderRadius: 10,
      activeBorderColor: '#7500b9',
      hoverBorderColor: '#8b2bc7',
    },
    Tabs: {
      itemActiveColor: '#7500b9',
      itemSelectedColor: '#7500b9',
      inkBarColor: '#7500b9',
    },
    Form: {
      fontSize: 12,
      margin: 8,
      marginLG: 12,
      marginXS: 4,
      padding: 8,
      paddingLG: 12,
      paddingXS: 4,
      itemMarginBottom: 4,
      verticalLabelPadding: '0 0 2px',
    },
  },
};
