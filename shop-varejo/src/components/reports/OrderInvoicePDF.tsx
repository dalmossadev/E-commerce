import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Tipagem simplificada baseada no Order domain do backend
export interface OrderPDFData {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: string;
  paymentMethod?: string;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string | Date;
  items: Array<{
    sku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    color?: string;
    size?: string;
  }>;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  orderInfo: {
    textAlign: 'right',
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#00AA00',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#F9F9F9',
    padding: 4,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: 80,
    color: '#666',
  },
  value: {
    flex: 1,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#F5F5F5',
    padding: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#F5F5F5',
    padding: 5,
  },
  colSku: { width: '15%' },
  colDesc: { width: '45%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '15%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right' },
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 200,
    marginBottom: 3,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#999',
    fontSize: 8,
    borderTop: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  }
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100);
};

export const OrderInvoicePDF = ({ order }: { order: OrderPDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName}>SISTERS LAB</Text>
          <Text>Rua Exemplo, 123 - Centro</Text>
          <Text>Cidade - Estado, CEP 00000-000</Text>
          <Text>Telefone: (00) 0000-0000</Text>
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTitle}>PEDIDO #{order.id}</Text>
          <Text>Data: {new Date(order.createdAt).toLocaleDateString('pt-BR')}</Text>
          <Text>Status: {order.status}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Cliente</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{order.customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{order.customerEmail}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telefone:</Text>
          <Text style={styles.value}>{order.customerPhone}</Text>
        </View>
      </View>

      {/* Shipping Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
        <Text>{order.shippingAddress || 'Não informado'}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.colSku}>SKU</Text>
          <Text style={styles.colDesc}>DESCRIÇÃO</Text>
          <Text style={styles.colQty}>QTD</Text>
          <Text style={styles.colPrice}>UNIT.</Text>
          <Text style={styles.colTotal}>TOTAL</Text>
        </View>
        {order.items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.colSku}>{item.sku}</Text>
            <View style={styles.colDesc}>
              <Text>{item.productName}</Text>
              {(item.color || item.size) && (
                <Text style={{ fontSize: 7, color: '#666' }}>
                  {item.color && `Cor: ${item.color}`} {item.size && `Tamanho: ${item.size}`}
                </Text>
              )}
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{formatCurrency(item.unitPrice)}</Text>
            <Text style={styles.colTotal}>{formatCurrency(item.totalPrice)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>{formatCurrency(order.subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Desconto:</Text>
          <Text style={styles.totalValue}>- {formatCurrency(order.discount)}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 5, borderTop: 1, borderTopColor: '#EEEEEE', paddingTop: 5 }]}>
          <Text style={[styles.totalLabel, { fontWeight: 'bold' }]}>TOTAL:</Text>
          <Text style={[styles.totalValue, { fontSize: 12, color: '#00AA00' }]}>{formatCurrency(order.total)}</Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Obrigado por comprar na Sisters Lab!{'\n'}
        Este documento é um romaneio de pedido e não substitui a Nota Fiscal Eletrônica (NF-e).
      </Text>
    </Page>
  </Document>
);
