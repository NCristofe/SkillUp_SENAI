import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, areaColors, levelColors } from '../styles/colors';
import Button from '../components/Button';

const AREA_ICONS = {
  'Desenvolvimento Web': 'web',
  'Desenvolvimento Mobile': 'cellphone',
  'Backend e APIs': 'server',
  'Banco de Dados': 'database',
  'DevOps e Nuvem': 'cloud',
};

export default function CourseDetailScreen({ route, navigation }) {
  const { course } = route.params;
  const [enrolled, setEnrolled] = useState(false);

  const areaColor = areaColors[course.area] ?? colors.secondary;
  const levelColor = levelColors[course.nivel] ?? colors.info;
  const areaIcon = AREA_ICONS[course.area] ?? 'book-open-variant';
  const stars = Math.round(course.classificacao);

  const handleEnroll = () => {
    if (enrolled) {
      Alert.alert('Atenção', 'Você já realizou a solicitação de matrícula neste curso.');
      return;
    }
    Alert.alert(
      'Confirmar Matrícula',
      `Deseja se matricular no curso:\n\n"${course.titulo}"?\n\nInvestimento: ${course.preco}\nDuração: ${course.duracao}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Matricular-se',
          onPress: () => {
            setEnrolled(true);
            Alert.alert(
              '🎉 Matrícula Solicitada!',
              'Sua solicitação foi registrada com sucesso. Nossa equipe entrará em contato em até 2 dias úteis com as instruções de acesso.',
            );
          },
        },
      ],
    );
  };

  const handleContact = () => {
    const subject = encodeURIComponent(`Dúvida sobre: ${course.titulo}`);
    const body = encodeURIComponent(
      `Olá!\n\nGostaria de obter informações sobre o curso "${course.titulo}".\n\nAguardo retorno. Obrigado(a)!`,
    );
    Linking.openURL(
      `mailto:cursos@senai-suico.com.br?subject=${subject}&body=${body}`,
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Compartilhar',
      `Link do curso copiado!\n\nCurso: ${course.titulo}\nÁrea: ${course.area}`,
    );
  };

  return (
    <View style={styles.container}>
      {/* Header customizado */}
      <View style={[styles.hero, { backgroundColor: areaColor }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <MaterialCommunityIcons name="share-variant" size={22} color="#fff" />
        </TouchableOpacity>

        <MaterialCommunityIcons name={areaIcon} size={56} color="rgba(255,255,255,0.9)" />
        <Text style={styles.heroArea}>{course.area}</Text>
        <Text style={styles.heroTitle}>{course.titulo}</Text>
        <Text style={styles.heroSub}>{course.subtitulo}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name={i < stars ? 'star' : 'star-outline'}
              size={20}
              color={i < stars ? colors.accent : 'rgba(255,255,255,0.4)'}
            />
          ))}
          <Text style={styles.ratingText}>
            {course.classificacao.toFixed(1)} / 5.0
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cards de informações rápidas */}
        <View style={styles.quickInfo}>
          <QuickCard
            icon="signal"
            label="Nível"
            value={course.nivel}
            color={levelColor}
          />
          <QuickCard
            icon="clock-time-four-outline"
            label="Carga Horária"
            value={course.duracao}
            color={areaColor}
          />
          <QuickCard
            icon="laptop"
            label="Modalidade"
            value={course.modalidade ?? 'Presencial'}
            color={colors.secondary}
          />
          <QuickCard
            icon="account-group-outline"
            label="Vagas"
            value={`${course.vagas}`}
            color={colors.success}
          />
        </View>

        {/* Investimento */}
        <View style={[styles.investCard, { borderLeftColor: colors.success }]}>
          <MaterialCommunityIcons
            name="currency-usd-off"
            size={24}
            color={colors.success}
          />
          <View style={styles.investInfo}>
            <Text style={styles.investLabel}>Investimento</Text>
            <Text style={[styles.investValue, { color: colors.success }]}>
              {course.preco ?? 'Gratuito'}
            </Text>
          </View>
          {course.certificado ? (
            <View style={styles.certBadge}>
              <MaterialCommunityIcons
                name="certificate-outline"
                size={14}
                color={colors.secondary}
              />
              <Text style={styles.certText}>Com certificado</Text>
            </View>
          ) : null}
        </View>

        {/* Professor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ministrante</Text>
          <View style={[styles.professorCard, { borderLeftColor: areaColor }]}>
            <View style={[styles.professorAvatar, { backgroundColor: areaColor }]}>
              <MaterialCommunityIcons name="account-tie" size={28} color="#fff" />
            </View>
            <View style={styles.professorInfo}>
              <Text style={styles.professorName}>{course.professor}</Text>
              <Text style={styles.professorRole}>
                Instrutor SENAI Suíço-Brasileira
              </Text>
            </View>
          </View>
        </View>

        {/* Sobre o curso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o curso</Text>
          <Text style={styles.descText}>{course.descricao}</Text>
        </View>

        {/* O que você vai aprender */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>O que você vai aprender</Text>
          {getTopics(course.area).map((topic, i) => (
            <View key={i} style={styles.topicRow}>
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={areaColor}
              />
              <Text style={styles.topicText}>{topic}</Text>
            </View>
          ))}
        </View>

        {/* Requisitos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pré-requisitos</Text>
          {getPrereqs(course.nivel).map((req, i) => (
            <View key={i} style={styles.topicRow}>
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color={colors.info}
              />
              <Text style={styles.topicText}>{req}</Text>
            </View>
          ))}
        </View>

        {/* Sobre a escola */}
        <View style={[styles.schoolBanner, { backgroundColor: areaColor + '15' }]}>
          <MaterialCommunityIcons name="school" size={24} color={areaColor} />
          <View style={styles.schoolInfo}>
            <Text style={[styles.schoolName, { color: areaColor }]}>
              SENAI Suíço-Brasileira
            </Text>
            <Text style={styles.schoolDesc}>
              Centro de excelência em formação tecnológica desde 1955.
              Parceria internacional com qualidade comprovada.
            </Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Barra de ações fixada */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.contactBtn} onPress={handleContact}>
          <MaterialCommunityIcons
            name="email-outline"
            size={22}
            color={colors.secondary}
          />
          <Text style={styles.contactBtnText}>Contato</Text>
        </TouchableOpacity>

        <Button
          label={enrolled ? 'Matrícula Solicitada ✓' : 'Matricular-se Agora'}
          variant={enrolled ? 'outline' : 'primary'}
          size="md"
          onPress={handleEnroll}
          style={styles.enrollBtn}
        />
      </View>
    </View>
  );
}

// ── Componente auxiliar ───────────────────────────────────────────────────────

function QuickCard({ icon, label, value, color }) {
  return (
    <View style={[quickStyles.card, { borderTopColor: color }]}>
      <MaterialCommunityIcons name={icon} size={20} color={color} />
      <Text style={quickStyles.label}>{label}</Text>
      <Text style={[quickStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const quickStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});

// ── Dados auxiliares ─────────────────────────────────────────────────────────

function getTopics(area) {
  const topics = {
    'Desenvolvimento Web': [
      'Estrutura e semântica HTML5',
      'Estilização avançada com CSS3',
      'Interatividade com JavaScript moderno',
      'Frameworks e bibliotecas populares',
      'Deploy e hospedagem de aplicações',
    ],
    'Desenvolvimento Mobile': [
      'Arquitetura de aplicativos mobile',
      'Navegação entre telas',
      'Consumo de APIs REST',
      'Armazenamento local e sincronização',
      'Publicação nas lojas de aplicativos',
    ],
    'Backend e APIs': [
      'Arquitetura RESTful',
      'Autenticação e autorização',
      'Modelagem e acesso a banco de dados',
      'Testes automatizados',
      'Deploy e escalabilidade',
    ],
    'Banco de Dados': [
      'Modelagem relacional e NoSQL',
      'Consultas e otimização',
      'Indexação e performance',
      'Backup e recuperação',
      'Administração e segurança',
    ],
    'DevOps e Nuvem': [
      'Containerização com Docker',
      'Orquestração com Kubernetes',
      'Pipelines CI/CD automatizados',
      'Monitoramento e alertas',
      'Infraestrutura como código',
    ],
  };
  return topics[area] ?? ['Fundamentos da área', 'Prática com projetos reais'];
}

function getPrereqs(nivel) {
  const map = {
    Iniciante: [
      'Conhecimentos básicos de informática',
      'Lógica de programação (desejável)',
      'Interesse e dedicação aos estudos',
    ],
    Intermediário: [
      'Conhecimentos básicos da área',
      'Experiência com ao menos uma linguagem de programação',
      'Familiaridade com terminal/linha de comando',
    ],
    Avançado: [
      'Experiência profissional de ao menos 1 ano na área',
      'Conhecimento sólido em programação orientada a objetos',
      'Experiência com controle de versão (Git)',
    ],
  };
  return map[nivel] ?? ['Consultar pré-requisitos com a secretaria'];
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Hero
  hero: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 16,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  shareBtn: {
    position: 'absolute',
    top: 52,
    right: 16,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  heroArea: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 28,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 3,
  },
  ratingText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // Infos rápidas
  quickInfo: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 16,
  },

  // Investimento
  investCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 12,
  },
  investInfo: { flex: 1 },
  investLabel: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase' },
  investValue: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  certText: { fontSize: 11, color: colors.secondary, fontWeight: '600' },

  // Seções
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  descText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Professor
  professorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    gap: 12,
  },
  professorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  professorInfo: { flex: 1 },
  professorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  professorRole: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  // Tópicos
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  topicText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },

  // Banner escola
  schoolBanner: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  schoolInfo: { flex: 1 },
  schoolName: { fontSize: 14, fontWeight: '800' },
  schoolDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  spacer: { height: 20 },

  // Barra de ações
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    gap: 12,
  },
  contactBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.secondary,
    gap: 3,
  },
  contactBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  enrollBtn: { flex: 1 },
});
