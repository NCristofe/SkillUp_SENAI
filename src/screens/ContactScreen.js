import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import Button from '../components/Button';
import { saveContact } from '../services/database';
import { sendContactMessage } from '../services/api';

const CONTACT_EMAIL = 'cursos@senai-suico.com.br';
const CONTACT_PHONE = '+551130007000';
const CONTACT_WHATSAPP = '+5511900000000';

export default function ContactScreen() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // ── Validação ─────────────────────────────────────────────────────────────

  const validate = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório.';
    if (!form.email.trim()) {
      errs.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Informe um e-mail válido.';
    }
    if (!form.mensagem.trim()) errs.mensagem = 'Mensagem é obrigatória.';
    if (form.mensagem.trim().length < 20)
      errs.mensagem = 'Mensagem muito curta (mínimo 20 caracteres).';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Envio ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Salvar localmente no SQLite
      await saveContact({
        nome: form.nome.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        mensagem: `[${form.assunto}] ${form.mensagem.trim()}`,
      });

      // Tentar enviar via API (Axios) — ignora erros de rede em dev
      try {
        await sendContactMessage({
          nome: form.nome.trim(),
          email: form.email.trim(),
          telefone: form.telefone.trim(),
          mensagem: form.mensagem.trim(),
        });
      } catch {
        // Em desenvolvimento sem servidor real, apenas registra localmente
      }

      setSent(true);
      setForm({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar sua mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setErrors({});
  };

  const update = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // ── Tela de sucesso ───────────────────────────────────────────────────────

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <MaterialCommunityIcons
            name="check-circle"
            size={72}
            color={colors.success}
          />
        </View>
        <Text style={styles.successTitle}>Mensagem enviada!</Text>
        <Text style={styles.successText}>
          Recebemos sua mensagem e nossa equipe entrará em contato em até{' '}
          <Text style={styles.successHighlight}>2 dias úteis</Text>.
        </Text>
        <Button
          label="Enviar nova mensagem"
          variant="primary"
          size="lg"
          onPress={handleReset}
          style={styles.successBtn}
        />
      </View>
    );
  }

  // ── Formulário ────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="email-fast" size={40} color="#fff" />
          <Text style={styles.headerTitle}>Fale Conosco</Text>
          <Text style={styles.headerSub}>
            Tire suas dúvidas sobre cursos, matrículas ou parceiras
          </Text>
        </View>

        {/* Canais rápidos */}
        <View style={styles.quickChannels}>
          <QuickChannel
            icon="whatsapp"
            label="WhatsApp"
            color="#25D366"
            onPress={() =>
              Linking.openURL(`whatsapp://send?phone=${CONTACT_WHATSAPP}`)
            }
          />
          <QuickChannel
            icon="phone"
            label="Ligar"
            color={colors.secondary}
            onPress={() => Linking.openURL(`tel:${CONTACT_PHONE}`)}
          />
          <QuickChannel
            icon="email"
            label="E-mail"
            color={colors.primary}
            onPress={() =>
              Linking.openURL(`mailto:${CONTACT_EMAIL}`)
            }
          />
        </View>

        {/* Formulário */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Enviar mensagem</Text>

          <Field
            label="Nome completo *"
            icon="account-outline"
            value={form.nome}
            onChangeText={update('nome')}
            error={errors.nome}
            placeholder="Seu nome completo"
            autoCapitalize="words"
          />

          <Field
            label="E-mail *"
            icon="email-outline"
            value={form.email}
            onChangeText={update('email')}
            error={errors.email}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Field
            label="Telefone / WhatsApp"
            icon="phone-outline"
            value={form.telefone}
            onChangeText={update('telefone')}
            error={errors.telefone}
            placeholder="(11) 99999-9999"
            keyboardType="phone-pad"
          />

          {/* Assunto */}
          <Text style={styles.fieldLabel}>Assunto</Text>
          <View style={styles.assuntoGrid}>
            {['Informações', 'Matrícula', 'Parceria', 'Outro'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.assuntoChip,
                  form.assunto === s && styles.assuntoChipActive,
                ]}
                onPress={() => update('assunto')(s)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.assuntoChipText,
                    form.assunto === s && styles.assuntoChipTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mensagem */}
          <Text style={styles.fieldLabel}>Mensagem *</Text>
          <View
            style={[
              styles.textAreaWrapper,
              errors.mensagem && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.textArea}
              value={form.mensagem}
              onChangeText={update('mensagem')}
              placeholder="Descreva sua dúvida ou solicitação..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          {errors.mensagem && (
            <Text style={styles.errorText}>{errors.mensagem}</Text>
          )}
          <Text style={styles.charCount}>
            {form.mensagem.length} / 500 caracteres
          </Text>

          <Button
            label="Enviar mensagem"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitBtn}
            icon={
              !loading && (
                <MaterialCommunityIcons
                  name="send"
                  size={18}
                  color="#fff"
                />
              )
            }
          />
        </View>

        {/* Horário de atendimento */}
        <View style={styles.scheduleCard}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color={colors.secondary}
          />
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleTitle}>Horário de atendimento</Text>
            <Text style={styles.scheduleText}>
              Segunda a Sexta: 8h às 18h{'\n'}Sábados: 8h às 12h
            </Text>
          </View>
        </View>

        <Text style={styles.privacyNote}>
          Ao enviar, você concorda com nossa{' '}
          <Text style={styles.privacyLink}>Política de Privacidade</Text>.
          Seus dados não serão compartilhados com terceiros.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Componentes auxiliares ────────────────────────────────────────────────────

function Field({
  label,
  icon,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.inputRow, error && fieldStyles.inputError]}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={error ? colors.error : colors.textMuted}
        />
        <TextInput
          style={fieldStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && <Text style={fieldStyles.error}>{error}</Text>}
    </View>
  );
}

function QuickChannel({ icon, label, color, onPress }) {
  return (
    <TouchableOpacity
      style={[quickStyles.btn, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={[quickStyles.label, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Estilos auxiliares ────────────────────────────────────────────────────────

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.error },
  error: { fontSize: 12, color: colors.error, marginTop: 4, marginLeft: 2 },
});

const quickStyles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    gap: 4,
  },
  label: { fontSize: 12, fontWeight: '700' },
});

// ── Estilos principais ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },

  // Sucesso
  successContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIcon: { marginBottom: 24 },
  successTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  successText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  successHighlight: { color: colors.primary, fontWeight: '700' },
  successBtn: { width: '100%' },

  // Header
  header: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    gap: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },

  // Canais rápidos
  quickChannels: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 10,
    marginBottom: 16,
  },

  // Formulário
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // Assunto
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  assuntoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  assuntoChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  assuntoChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  assuntoChipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  assuntoChipTextActive: { color: '#fff' },

  // Textarea
  textAreaWrapper: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 12,
    minHeight: 120,
    marginBottom: 4,
  },
  textArea: {
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 100,
  },
  inputError: { borderColor: colors.error },
  errorText: { fontSize: 12, color: colors.error, marginBottom: 8, marginLeft: 2 },
  charCount: { fontSize: 11, color: colors.textMuted, textAlign: 'right', marginBottom: 16 },

  submitBtn: { marginTop: 4 },

  // Horário
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondary + '10',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
    marginBottom: 16,
  },
  scheduleInfo: { flex: 1 },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  scheduleText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  privacyNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 18,
  },
  privacyLink: { color: colors.primary, fontWeight: '600' },
});
