import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts'; // Add this import to fix the ReferenceError

// Updated API base URL to localhost:8000
const API_BASE_URL = 'http://localhost:8000';

const KPIDashboard = () => {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await fetch(`${API_BASE_URL}/api/dashboard/kpi/all?status=active`);
        if (!response.ok) {
          throw new Error('Failed to fetch KPI data');
        }
        const data = await response.json();
        setKpiData(Array.isArray(data) ? data : [data]); // Ensure it's an array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKpiData();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100vh', width: '100vw' }}><div style={{ textAlign: 'right' }}>Loading...</div></div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100vh', width: '100vw' }}><div style={{ textAlign: 'right' }}>Error: {error}</div></div>;

  // Assuming single KPI for simplicity; if array, you can map over it or aggregate.
  // Here, using the first item if array.
  const kpi = kpiData[0] || {};

  // Enhanced chart configurations with cooler styles: vibrant colors, animations, shadows, etc.
  const statusBarOption = {
    title: {
      text: 'Status Counts',
      textStyle: { color: '#333', fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.7)', textStyle: { color: '#fff' } },
    backgroundColor: '#f8f9fa',
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: Object.keys(kpi.status?.counts || {}),
      axisLine: { lineStyle: { color: '#ddd' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [{
      data: Object.values(kpi.status?.counts || {}),
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#4CAF50' },
          { offset: 1, color: '#45a049' }
        ]),
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowBlur: 10
      },
      barWidth: '60%',
      animationDuration: 1000,
      animationEasing: 'elasticOut'
    }]
  };

  const verificationPieOption = {
    title: {
      text: 'Verification Status',
      textStyle: { color: '#333', fontSize: 16, fontWeight: 'bold' },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0,0,0,0.7)',
      textStyle: { color: '#fff' }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: { color: '#666' }
    },
    series: [{
      name: 'Verification',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: Object.entries(kpi.verificationStatus || {})
        .map(([name, value]) => ({
          name,
          value,
          itemStyle: {
            color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][Math.floor(Math.random() * 5)] // Random vibrant colors; customize as needed
          }
        })),
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) { return idx * 100; }
    }]
  };

  const confirmationPieOption = {
    title: {
      text: 'Confirmation',
      textStyle: { color: '#333', fontSize: 16, fontWeight: 'bold' },
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0,0,0,0.7)',
      textStyle: { color: '#fff' }
    },
    legend: {
      orient: 'vertical',
      right: 'right',
      top: 'center',
      textStyle: { color: '#666' }
    },
    series: [{
      name: 'Confirmation',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: Object.entries(kpi.confirmation || {})
        .map(([name, value]) => ({
          name,
          value,
          itemStyle: {
            color: ['#FF6384', '#36A2EB'][name === 'Agreed' ? 1 : 0] // Green for Agreed, Red for Rejected
          }
        })),
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) { return idx * 100; }
    }]
  };

  const monthlyLineOption = {
    title: {
      text: 'Monthly Progress',
      textStyle: { color: '#333', fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.7)',
      textStyle: { color: '#fff' }
    },
    backgroundColor: '#f8f9fa',
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    legend: { data: ['Progress'], textStyle: { color: '#666' } },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisLine: { lineStyle: { color: '#ddd' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [{
      name: 'Progress',
      data: Object.values(kpi.monthlyProgress || {}),
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        color: '#2196F3',
        width: 3
      },
      itemStyle: {
        color: '#2196F3',
        borderColor: '#fff',
        borderWidth: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
          { offset: 1, color: 'rgba(33, 150, 243, 0)' }
        ])
      },
      animationDuration: 2000,
      animationEasing: 'quarticOut'
    }]
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f2f5', 
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end' // Sağ tarafa yasla
    }}>
      <h1 style={{ 
        textAlign: 'right', // Başlığı sağa yasla
        color: '#333', 
        marginBottom: '30px', 
        fontSize: '2.5rem', 
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        width: '100%',
        paddingRight: '20px' // Ekstra sağ hizalama
      }}>KPI Dashboard</h1>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'flex-end', // İçeriği sağ tarafa yasla
        alignItems: 'flex-start', // Üstten hizala
        gap: '30px',
        maxWidth: '1400px',
        width: '100%',
        marginLeft: 'auto', // Sağdan hizalama için
        paddingRight: '20px' // Ekstra sağ padding
      }}>
        {/* Total Actions Card - Enhanced */}
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '12px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          minWidth: '300px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Total Actions</h3>
          <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0' }}>{kpi.totalActions || 0}</p>
          <p style={{ fontSize: '1.2rem', margin: '0' }}>Average Status: {kpi.status?.average || 0}%</p>
        </div>

        {/* Status Bar Chart - Centered */}
        <div style={{ width: '450px', height: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
          <ReactECharts 
            option={statusBarOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'canvas' }}
          />
        </div>

        {/* Verification Pie Chart - Centered */}
        <div style={{ width: '450px', height: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
          <ReactECharts 
            option={verificationPieOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'canvas' }}
          />
        </div>

        {/* Confirmation Pie Chart - Centered */}
        <div style={{ width: '450px', height: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
          <ReactECharts 
            option={confirmationPieOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'canvas' }}
          />
        </div>

        {/* Monthly Progress Line Chart - Centered */}
        <div style={{ width: '600px', height: '350px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
          <ReactECharts 
            option={monthlyLineOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;