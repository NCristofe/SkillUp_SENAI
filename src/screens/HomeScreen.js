import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, areaColors } from '../styles/colors';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';
import { getAllCourses, searchCourses, getAreas } from '../services/database';

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // ── Carregamento de dados ─────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [all, areaList] = await Promise.all([getAllCourses(), getAreas()]);
      setCourses(all);
      setFiltered(all);
      setAreas(areaList);
    } catch (e) {
      console.error('Erro ao carregar cursos:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Filtros ───────────────────────────────────────────────────────────────

  useEffect(() => {
    applyFilters(search, selectedArea);
  }, [search, selectedArea, courses]);

  const applyFilters = async (query, area) => {
    let result = courses;

    if (query.trim().length >= 2) {
      result = await searchCourses(query.trim());
    }

    if (area) {
      result = result.filter((c) => c.area === area);
    }

    setFiltered(result);
  };

  const handleAreaFilter = (area) => {
    setSelectedArea((prev) => (prev === area ? null : area));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ── Modal ─────────────────────────────────────────────────────────────────

  const handleCardPress = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleViewDetail = (course) => {
    navigation.navigate('CourseDetail', { course });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const renderHeader = () => (
    <View>
      {/* Cabeçalho principal */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>SENAI Suíço-Brasileira</Text>
          <Text style={styles.headerSubtitle}>
            {courses.length} cursos de desenvolvimento disponíveis
          </Text>
        </View>
        <MaterialCommunityIcons
          name="school"
          size={36}
          color="rgba(255,255,255,0.9)"
        />
      </View>

      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textMuted}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar cursos, áreas, professores..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtro por área */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filtrar por área</Text>
        <FlatList
          horizontal
          data={areas}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const active = selectedArea === item;
            const areaColor = areaColors[item] ?? colors.secondary;
            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  active && { backgroundColor: areaColor, borderColor: areaColor },
                ]}
                onPress={() => handleAreaFilter(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && { color: '#fff' },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Contagem de resultados */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>
          {filtered.length === 0
            ? 'Nenhum resultado encontrado'
            : `${filtered.length} curso${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
        </Text>
        {(search || selectedArea) && (
          <TouchableOpacity
            onPress={() => {
              setSearch('');
              setSelectedArea(null);
            }}
          >
            <Text style={styles.clearFilters}>Limpar filtros</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando cursos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CourseCard course={item} onPress={handleCardPress} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons
              name="book-search-outline"
              size={64}
              color={colors.border}
            />
            <Text style={styles.emptyTitle}>Nenhum curso encontrado</Text>
            <Text style={styles.emptyText}>
              Tente buscar por outro termo ou remova os filtros aplicados.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      <CourseModal
        visible={modalVisible}
        course={selectedCourse}
        onClose={() => setModalVisible(false)}
        onViewDetail={handleViewDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: { color: colors.textSecondary, fontSize: 14 },

  // Cabeçalho
  header: {
    backgroundColor: colors.primary,
    paddingTop: 24,
    paddingBottom: 28,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },

  // Busca
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: -18,
    marginBottom: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  // Filtros
  filterSection: { paddingTop: 16 },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterList: { paddingHorizontal: 12, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Resultados
  resultsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  resultsText: { fontSize: 13, color: colors.textMuted },
  clearFilters: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // Lista
  listContent: { paddingBottom: 24 },

  // Vazio
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
