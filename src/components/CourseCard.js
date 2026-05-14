import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, areaColors, levelColors } from '../styles/colors';

const AREA_ICONS = {
  'Desenvolvimento Web': 'web',
  'Desenvolvimento Mobile': 'cellphone',
  'Backend e APIs': 'server',
  'Banco de Dados': 'database',
  'DevOps e Nuvem': 'cloud',
};

export default function CourseCard({ course, onPress }) {
  const areaColor = areaColors[course.area] ?? colors.secondary;
  const levelColor = levelColors[course.nivel] ?? colors.info;
  const areaIcon = AREA_ICONS[course.area] ?? 'book-open-variant';
  const stars = Math.round(course.classificacao);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(course)}
      activeOpacity={0.9}
    >
      <View style={[styles.areaStripe, { backgroundColor: areaColor }]}>
        <MaterialCommunityIcons name={areaIcon} size={22} color="#fff" />
        <Text style={styles.areaText}>{course.area}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.titulo} numberOfLines={2}>
          {course.titulo}
        </Text>
        <Text style={styles.subtitulo} numberOfLines={2}>
          {course.subtitulo}
        </Text>

        <View style={styles.metaRow}>
          <View style={[styles.levelBadge, { backgroundColor: levelColor + '22' }]}>
            <View style={[styles.levelDot, { backgroundColor: levelColor }]} />
            <Text style={[styles.levelText, { color: levelColor }]}>
              {course.nivel}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textMuted} />
            <Text style={styles.metaText}>{course.duracao}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.professorRow}>
            <MaterialCommunityIcons name="account-tie" size={15} color={colors.textMuted} />
            <Text style={styles.professorText} numberOfLines={1}>
              {course.professor}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <MaterialCommunityIcons
                key={i}
                name={i < stars ? 'star' : 'star-outline'}
                size={14}
                color={i < stars ? colors.accent : colors.border}
              />
            ))}
            <Text style={styles.ratingText}>{course.classificacao.toFixed(1)}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.arrow, { backgroundColor: areaColor }]}>
        <MaterialCommunityIcons name="chevron-right" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  areaStripe: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  areaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  body: {
    padding: 14,
    paddingRight: 36,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  professorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  professorText: {
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 4,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  arrow: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -16,
    width: 28,
    height: 32,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
