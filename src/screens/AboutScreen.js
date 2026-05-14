import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const STATS = [
  { label: 'Anos de história', value: '70+', icon: 'calendar-star' },
  { label: 'Alunos formados', value: '50k+', icon: 'account-group' },
  { label: 'Cursos ativos', value: '120+', icon: 'book-open-variant' },
  { label: 'Empresas parceiras', value: '300+', icon: 'handshake' },
];

const VALUES = [
  {
    icon: 'medal-outline',
    title: 'Excelência',
    desc: 'Compromisso com a qualidade em cada curso e programa de formação.',
  },
  {
    icon: 'lightbulb-outline',
    title: 'Inovação',
    desc: 'Currículo atualizado com as tendências do mercado de tecnologia.',
  },
  {
    icon: 'earth',
    title: 'Internacionalização',
    desc: 'Parceria suíço-brasileira com padrões internacionais de ensino.',
  },
  {
    icon: 'handshake-outline',
    title: 'Empregabilidade',
    desc: 'Rede de parceiros que conecta alunos ao mercado de trabalho.',
  },
];

const CONTACTS = [
  {
    icon: 'map-marker',
    label: 'Endereço',
    value: 'Av. Paulista, 1000 — São Paulo, SP',
    action: () =>
      Linking.openURL('https://maps.google.com/?q=Av+Paulista+1000+São+Paulo'),
  },
  {
    icon: 'phone',
    label: 'Telefone',
    value: '(11) 3000-7000',
    action: () => Linking.openURL('tel:+551130007000'),
  },
  {
    icon: 'email',
    label: 'E-mail',
    value: 'contato@senai-suico.com.br',
    action: () => Linking.openURL('mailto:contato@senai-suico.com.br'),
  },
  {
    icon: 'web',
    label: 'Site',
    value: 'www.senai-suico.com.br',
    action: () => Linking.openURL('https://www.senai.br'),
  },
];

export default function AboutScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <MaterialCommunityIcons name="school" size={56} color="#fff" />
        <Text style={styles.heroTitle}>SENAI Suíço-Brasileira</Text>
        <Text style={styles.heroSub}>
          Centro de Tecnologia e Inovação
        </Text>
        <View style={styles.heroBadge}>
          <MaterialCommunityIcons name="star" size={14} color={colors.accent} />
          <Text style={styles.heroBadgeText}>Instituição de Ensino Parceira do SENAI-SP</Text>
        </View>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsGrid}>
        {STATS.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <MaterialCommunityIcons
              name={stat.icon}
              size={28}
              color={colors.primary}
            />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Missão */}
      <View style={styles.section}>
        <SectionHeader icon="flag-outline" title="Nossa Missão" />
        <Text style={styles.bodyText}>
          Promover a educação profissional e tecnológica de excelência, formando
          profissionais altamente qualificados para o mercado de trabalho, por
          meio de uma parceria única entre Brasil e Suíça que une tradição
          europeia com inovação brasileira.
        </Text>
      </View>

      {/* História */}
      <View style={styles.section}>
        <SectionHeader icon="history" title="Nossa História" />
        <Text style={styles.bodyText}>
          Fundada em 1955, a SENAI Suíço-Brasileira nasceu de um acordo
          bilateral entre os governos do Brasil e da Suíça para o
          desenvolvimento da formação profissional no país. Ao longo de mais de
          sete décadas, formou dezenas de milhares de profissionais em áreas
          técnicas e tecnológicas.
        </Text>
        <Text style={[styles.bodyText, { marginTop: 12 }]}>
          Com a revolução digital, a instituição expandiu seu portfólio para
          incluir cursos de desenvolvimento de software, ciência de dados e
          computação em nuvem, mantendo o rigor técnico que é sua marca
          registrada.
        </Text>
      </View>

      {/* Valores */}
      <View style={styles.section}>
        <SectionHeader icon="heart-outline" title="Nossos Valores" />
        <View style={styles.valuesGrid}>
          {VALUES.map((v) => (
            <View key={v.title} style={styles.valueCard}>
              <View style={styles.valueIconBox}>
                <MaterialCommunityIcons
                  name={v.icon}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.valueTitle}>{v.title}</Text>
              <Text style={styles.valueDesc}>{v.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Infraestrutura */}
      <View style={styles.section}>
        <SectionHeader icon="office-building" title="Infraestrutura" />
        {[
          '20 laboratórios de informática com equipamentos de última geração',
          'Biblioteca com acervo técnico e acesso a plataformas digitais',
          'Salas de aula presenciais e estúdio para aulas online',
          'Área de coworking para projetos colaborativos',
          'Conexão de alta velocidade em todo o campus',
        ].map((item, i) => (
          <View key={i} style={styles.infraRow}>
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color={colors.success}
            />
            <Text style={styles.infraText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Contato / Localização */}
      <View style={styles.section}>
        <SectionHeader icon="map-marker-outline" title="Onde nos encontrar" />
        {CONTACTS.map((c) => (
          <TouchableOpacity
            key={c.label}
            style={styles.contactRow}
            onPress={c.action}
            activeOpacity={0.7}
          >
            <View style={styles.contactIconBox}>
              <MaterialCommunityIcons
                name={c.icon}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactValue}>{c.value}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <MaterialCommunityIcons name="school" size={20} color={colors.textMuted} />
        <Text style={styles.footerText}>
          © 2025 SENAI Suíço-Brasileira · Todos os direitos reservados
        </Text>
      </View>
    </ScrollView>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <View style={sectionHeaderStyles.row}>
      <View style={sectionHeaderStyles.iconBox}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={sectionHeaderStyles.title}>{title}</Text>
    </View>
  );
}

const sectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },

  // Hero
  hero: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 6,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
    gap: 6,
  },
  heroBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Estatísticas
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: -20,
    gap: 8,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    gap: 4,
    marginLeft: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Seções
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Valores
  valuesGrid: { gap: 10 },
  valueCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  valueIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  valueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  valueDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 18,
    marginTop: 2,
  },

  // Infraestrutura
  infraRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  infraText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },

  // Contatos
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    gap: 12,
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },

  // Rodapé
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
