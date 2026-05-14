import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, areaColors, levelColors } from '../styles/colors';
import Button from './Button';

const AREA_ICONS = {
  'Desenvolvimento Web': 'web',
  'Desenvolvimento Mobile': 'cellphone',
  'Backend e APIs': 'server',
  'Banco de Dados': 'database',
  'DevOps e Nuvem': 'cloud',
};

export default function CourseModal({ visible, course, onClose, onViewDetail }) {
  if (!course) return null;

  const areaColor = areaColors[course.area] ?? colors.secondary;
  const levelColor = levelColors[course.nivel] ?? colors.info;
  const areaIcon = AREA_ICONS[course.area] ?? 'book-open-variant';
  const stars = Math.round(course.classificacao);

  const handleEnroll = () => {
    Alert.alert(
      'Matrícula',
      `Deseja realizar a matrícula no curso:\n\n"${course.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: () => {
            Alert.alert(
              'Sucesso!',
              'Sua solicitação de matrícula foi registrada. Em breve nossa equipe entrará em contato.',
              [{ text: 'OK', onPress: onClose }],
            );
          },
        },
      ],
    );
  };

  const handleContact = () => {
    const subject = encodeURIComponent(
      `Informações sobre o curso: ${course.titulo}`,
    );
    const body = encodeURIComponent(
      `Olá, gostaria de obter mais informações sobre o curso "${course.titulo}" oferecido pela SENAI Suíço-Brasileira.\n\nAguardo retorno.`,
    );
    Linking.openURL(
      `mailto:cursos@senai-suico.com.br?subject=${subject}&body=${body}`,
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={styles.sheet}>
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Botão fechar */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <MaterialCommunityIcons
            name="close"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cabeçalho colorido */}
          <View style={[styles.header, { backgroundColor: areaColor }]}>
            <MaterialCommunityIcons name={areaIcon} size={32} color="#fff" />
            <Text style={styles.areaLabel}>{course.area}</Text>
          </View>

          <View style={styles.content}>
            {/* Título */}
            <Text style={styles.titulo}>{course.titulo}</Text>
            <Text style={styles.subtitulo}>{course.subtitulo}</Text>

            {/* Classificação */}
            <View style={styles.ratingRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialCommunityIcons
                  key={i}
                  name={i < stars ? 'star' : 'star-outline'}
                  size={18}
                  color={i < stars ? colors.accent : colors.border}
                />
              ))}
              <Text style={styles.ratingValue}>
                {course.classificacao.toFixed(1)}
              </Text>
            </View>

            {/* Grid de informações */}
            <View style={styles.infoGrid}>
              <InfoItem
                icon="signal"
                label="Nível"
                value={course.nivel}
                valueColor={levelColor}
              />
              <InfoItem
                icon="clock-outline"
                label="Duração"
                value={course.duracao}
              />
              <InfoItem
                icon="laptop"
                label="Modalidade"
                value={course.modalidade ?? 'Presencial'}
              />
              <InfoItem
                icon="account-group"
                label="Vagas"
                value={`${course.vagas} vagas`}
              />
              <InfoItem
                icon="currency-usd-off"
                label="Investimento"
                value={course.preco ?? 'Gratuito'}
                valueColor={colors.success}
              />
              <InfoItem
                icon="certificate-outline"
                label="Certificado"
                value={course.certificado ? 'Incluso' : 'Não incluso'}
                valueColor={course.certificado ? colors.success : colors.textMuted}
              />
            </View>

            {/* Professor */}
            <View style={styles.professorBox}>
              <MaterialCommunityIcons
                name="account-tie"
                size={20}
                color={areaColor}
              />
              <View style={styles.professorInfo}>
                <Text style={styles.professorLabel}>Ministrante</Text>
                <Text style={styles.professorName}>{course.professor}</Text>
              </View>
            </View>

            {/* Descrição */}
            <View style={styles.descSection}>
              <Text style={styles.descLabel}>Sobre o curso</Text>
              <Text style={styles.descText}>{course.descricao}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Botões de ação */}
        <View style={styles.actions}>
          <Button
            label="Ver detalhes completos"
            variant="outline"
            size="md"
            fullWidth
            onPress={() => {
              onClose();
              if (onViewDetail) onViewDetail(course);
            }}
            style={styles.btnOutline}
          />
          <View style={styles.actionRow}>
            <Button
              label="Contato"
              variant="secondary"
              size="md"
              onPress={handleContact}
              style={styles.btnHalf}
              icon={
                <MaterialCommunityIcons
                  name="email-outline"
                  size={16}
                  color="#fff"
                />
              }
            />
            <Button
              label="Matricular-se"
              variant="primary"
              size="md"
              onPress={handleEnroll}
              style={styles.btnHalf}
              icon={
                <MaterialCommunityIcons
                  name="school-outline"
                  size={16}
                  color="#fff"
                />
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function InfoItem({ icon, label, value, valueColor }) {
  return (
    <View style={infoStyles.item}>
      <MaterialCommunityIcons
        name={icon}
        size={16}
        color={colors.textMuted}
        style={infoStyles.icon}
      />
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={[infoStyles.value, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  item: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  icon: { marginBottom: 2 },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 10,
  },

  scrollContent: { paddingBottom: 8 },

  header: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  areaLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginTop: 6,
    opacity: 0.9,
  },

  content: { paddingHorizontal: 20, paddingTop: 16 },

  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 26,
  },
  subtitulo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 2,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 6,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },

  professorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  professorInfo: { flex: 1 },
  professorLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  professorName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },

  descSection: { marginTop: 16 },
  descLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  actions: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    gap: 10,
  },
  btnOutline: { marginBottom: 0 },
  actionRow: { flexDirection: 'row', gap: 10 },
  btnHalf: { flex: 1 },
});
