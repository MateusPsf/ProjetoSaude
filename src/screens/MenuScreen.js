import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import theme from '../theme';

export default function MenuScreen({ navigation }) {
  const [gameMode, setGameMode] = useState('ai'); // 'ai' ou 'pvp'
  const [player1Name, setPlayer1Name] = useState('Jogador 1');
  const [player2Name, setPlayer2Name] = useState('Jogador 2');
  const [showRules, setShowRules] = useState(false);

  const handleStart = () => {
    const p2 = gameMode === 'ai' ? 'IA' : player2Name || 'Jogador 2';
    navigation.navigate('Game', {
      gameMode,
      player1Name: player1Name || 'Jogador 1',
      player2Name: p2,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Ícone / Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>✚</Text>
        </View>
        <View style={styles.heartBadge}>
          <Text style={styles.heartText}>❤️</Text>
        </View>
      </View>

      {/* Título */}
      <Text style={styles.title}>Quiz da Saúde</Text>
      <Text style={styles.subtitle}>Jogo da Velha Educativo</Text>

      {/* Card principal */}
      <View style={styles.card}>
        <Text style={styles.description}>
          Escolha o modo de jogo, defina os nomes e prepare-se para o desafio!
        </Text>

        {/* Modo de jogo */}
        <Text style={styles.label}>Modo de Jogo</Text>
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              gameMode === 'ai' ? styles.modeBtnActive : styles.modeBtnInactive,
            ]}
            onPress={() => setGameMode('ai')}
          >
            <Text
              style={[
                styles.modeBtnText,
                gameMode === 'ai'
                  ? styles.modeBtnTextActive
                  : styles.modeBtnTextInactive,
              ]}
            >
              vs. IA
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              gameMode === 'pvp' ? styles.modeBtnActive : styles.modeBtnInactive,
            ]}
            onPress={() => setGameMode('pvp')}
          >
            <Text
              style={[
                styles.modeBtnText,
                gameMode === 'pvp'
                  ? styles.modeBtnTextActive
                  : styles.modeBtnTextInactive,
              ]}
            >
              vs. Jogador
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nome jogador 1 */}
        <Text style={styles.label}>Jogador 1 (X)</Text>
        <TextInput
          style={styles.input}
          value={player1Name}
          onChangeText={setPlayer1Name}
          placeholder="Nome do Jogador 1"
          placeholderTextColor={theme.colors.gray500}
        />

        {/* Nome jogador 2 (só aparece no PvP) */}
        {gameMode === 'pvp' && (
          <>
            <Text style={styles.label}>Jogador 2 (O)</Text>
            <TextInput
              style={styles.input}
              value={player2Name}
              onChangeText={setPlayer2Name}
              placeholder="Nome do Jogador 2"
              placeholderTextColor={theme.colors.gray500}
            />
          </>
        )}

        {/* Botão Começar */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
          <Text style={styles.primaryBtnText}>▶  Começar Jogo</Text>
        </TouchableOpacity>

        {/* Botão Regras */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setShowRules(true)}
        >
          <Text style={styles.secondaryBtnText}>❓  Como Jogar</Text>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🎯</Text>
            </View>
            <Text style={styles.featureLabel}>Perguntas</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>🏆</Text>
            </View>
            <Text style={styles.featureLabel}>Competição</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureEmoji}>📚</Text>
            </View>
            <Text style={styles.featureLabel}>Aprendizado</Text>
          </View>
        </View>
      </View>

      {/* Rodapé */}
      <Text style={styles.footer}>📖 Projeto Acadêmico 2024</Text>
      <Text style={styles.footerSub}>Desenvolvido com ❤️ para educação em saúde</Text>

      {/* Modal de Regras */}
      <Modal
        visible={showRules}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRules(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowRules(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>📋 Como Jogar</Text>

            {[
              'Dois jogadores se alternam respondendo perguntas sobre saúde.',
              'Acertou a pergunta? Escolha uma casa no tabuleiro para marcar.',
              'Errou? A vez passa para o outro jogador.',
              'Vence quem conseguir alinhar 3 símbolos (horizontal, vertical ou diagonal)!',
            ].map((text, idx) => (
              <View key={idx} style={styles.ruleRow}>
                <View style={styles.ruleNumber}>
                  <Text style={styles.ruleNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.ruleText}>{text}</Text>
              </View>
            ))}

            <View style={styles.tipBox}>
              <Text style={styles.tipText}>
                💡 Dica: Aprenda enquanto joga! Cada pergunta errada é uma
                oportunidade de aprendizado.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },

  // Logo
  logoContainer: {
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  logoIcon: {
    fontSize: 48,
    color: theme.colors.emerald500,
    fontWeight: 'bold',
  },
  heartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.red500,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  heartText: {
    fontSize: 14,
  },

  // Títulos
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.emerald700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.emerald600,
    marginBottom: theme.spacing.lg,
  },

  // Card
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 420,
    ...theme.shadows.lg,
  },
  description: {
    textAlign: 'center',
    color: theme.colors.gray600,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },

  // Modo
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.emerald700,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: theme.colors.emerald200,
    borderColor: theme.colors.emerald400,
  },
  modeBtnInactive: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray200,
  },
  modeBtnText: {
    fontWeight: '600',
    fontSize: 15,
  },
  modeBtnTextActive: {
    color: theme.colors.emerald800,
  },
  modeBtnTextInactive: {
    color: theme.colors.gray600,
  },

  // Input
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    borderRadius: theme.borderRadius.md,
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },

  // Botões
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  secondaryBtnText: {
    color: theme.colors.emerald600,
    fontWeight: '700',
    fontSize: 18,
  },

  // Features
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.emerald100,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.emerald100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureLabel: {
    fontSize: 12,
    color: theme.colors.gray600,
    fontWeight: '500',
  },

  // Rodapé
  footer: {
    marginTop: theme.spacing.xl,
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.emerald600,
  },
  footerSub: {
    fontSize: 12,
    color: theme.colors.emerald500,
    opacity: 0.7,
    marginTop: 4,
    marginBottom: theme.spacing.lg,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  modalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.emerald100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 18,
    color: theme.colors.emerald600,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.emerald700,
    marginBottom: theme.spacing.lg,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.emerald500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleNumberText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  ruleText: {
    flex: 1,
    color: theme.colors.gray600,
    fontSize: 14,
    lineHeight: 20,
  },
  tipBox: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.emerald50,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  tipText: {
    fontSize: 13,
    color: theme.colors.emerald700,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 19,
  },
});
