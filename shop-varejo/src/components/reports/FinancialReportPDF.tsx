import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { FinancialDashboardData } from '@/lib/api/services/financialService';

// Registro de fontes para um visual mais profissional (opcional, mas recomendado)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#00FF00',
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#F5F5F5',
    padding: 5,
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#FAFAFA',
    padding: 5,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableCell: {
    fontSize: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
  }
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100);
};

export const FinancialReportPDF = ({ data }: { data: FinancialDashboardData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SISTERS LAB</Text>
          <Text style={styles.subtitle}>Relatório de Performance Financeira</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={styles.subtitle}>Gerado em: {new Date().toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.subtitle}>Período: Consolidado</Text>
        </View>
      </View>

      {/* Resumo Geral */}
      <Text style={styles.sectionTitle}>Resumo Executivo</Text>
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Lucro Líquido</Text>
          <Text style={[styles.cardValue, { color: '#00AA00' }]}>{formatCurrency(data.currentBalance.net)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Receita Bruta</Text>
          <Text style={styles.cardValue}>{formatCurrency(data.currentBalance.income)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Despesas Totais</Text>
          <Text style={styles.cardValue}>{formatCurrency(data.currentBalance.expense)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Taxas Operacionais</Text>
          <Text style={styles.cardValue}>{formatCurrency(data.currentBalance.fees)}</Text>
        </View>
      </View>

      {/* Tabela Mensal */}
      <Text style={styles.sectionTitle}>Performance Mensal (Últimos 12 meses)</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Mês</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Receita</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Despesa</Text></View>
          <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Líquido</Text></View>
        </View>
        {data.charts.monthly.map((m, i) => (
          <View style={styles.tableRow} key={i}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{m.period}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(m.income)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(m.expense)}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{formatCurrency(m.net)}</Text></View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Este documento é de uso interno e confidencial da Sisters Lab. 
        As informações contidas são baseadas no ledger financeiro em tempo real.
      </Text>
    </Page>
  </Document>
);
