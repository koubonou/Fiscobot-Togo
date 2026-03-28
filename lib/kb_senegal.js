// Base de Connaissances Fiscale - Senegal
// Source : Code General des Impots Senegal (CGI DGID) 2025
// Direction Generale des Impots et Domaines (DGID)

export const KB_SENEGAL = [

  `=== SEN-01 | GENERALITES | SYSTEME FISCAL SENEGALAIS 2025 ===
TITRE: Systeme fiscal senegalais - Vue d'ensemble 2025
PRINCIPE: Le Senegal dispose d'un systeme fiscal administre par la Direction Generale des Impots et Domaines (DGID). Le pays est membre de l'UEMOA et de l'OHADA.
DETAILS:
- Autorite fiscale : Direction Generale des Impots et Domaines (DGID)
- Site officiel : www.impotsetdomaines.gouv.sn
- Monnaie : Franc CFA (XOF) - meme zone monetaire que le Togo
- Zone UEMOA : Oui - directives communautaires applicables
- Zone OHADA : Oui - SYSCOHADA applicable
- Principaux impots : IS, IRPP, TVA, CFE, CFU, Patente, Droits d'enregistrement
- Declarations en ligne : e-tax DGID (portail fiscal)
REFERENCES: CGI Senegal 2025 | DGID`,

  `=== SEN-02 | IS | IMPOT SUR LES SOCIETES - SENEGAL ===
TITRE: Impot sur les Societes (IS) - Senegal 2025
PRINCIPE: L'IS frappe les benefices realises par les societes et autres personnes morales au Senegal.
TAUX IS SENEGAL:
- Taux normal IS : 30% (vs 27% au Togo)
- Taux reduit PME : 15% (si CA < 250 millions FCFA et capital detenu a 100% par residents)
- Minimum Forfaitaire de Perception (MFP) : 0,5% du CA HT (minimum 500 000 FCFA)
ASSIETTE:
- Benefice net apres deduction des charges
- Exercice comptable : 1er janvier au 31 decembre
- Declaration : avant le 30 avril de l'annee N+1
- Paiement : acomptes provisionnels trimestriels (25% de l'IS N-1)
CHARGES DEDUCTIBLES:
- Amortissements, provisions, interets d'emprunt dans les limites legales
- Charges de personnel (remunerations, charges sociales IPRES/CSS)
REFERENCES: Art. 36 a 80 CGI Senegal | DGID`,

  `=== SEN-03 | TVA | TAXE SUR LA VALEUR AJOUTEE - SENEGAL ===
TITRE: TVA Senegal - Taux, seuil et declaration 2025
PRINCIPE: La TVA est un impot indirect sur la consommation collecte par les entreprises assujetties.
TAUX TVA SENEGAL:
- Taux normal : 18% (identique au Togo)
- Taux zero : exportations, produits alimentaires de base (riz, pain, lait...)
- Exonerations : education, sante, agriculture, peche artisanale
SEUIL D'ASSUJETTISSEMENT:
- Regime du reel : CA > 50 millions FCFA/an (plus bas qu'au Togo : 100M)
- En dessous de 50M FCFA : regime de la Contribution Globale Unique (CGU)
DECLARATION ET PAIEMENT:
- Declaration mensuelle : avant le 15 du mois suivant
- Declaration trimestrielle : pour certains regimes simplifies
- Dep\u00f4t : via e-tax DGID en ligne
CREDIT DE TVA:
- Remboursement possible si credit > 25 millions FCFA
- Delai de remboursement : 3 mois maximum
REFERENCES: Art. 355 a 520 CGI Senegal | DGID`,

  `=== SEN-04 | IRPP | IMPOT SUR LE REVENU - SENEGAL ===
TITRE: IRPP Senegal - Impot sur le Revenu des Personnes Physiques
PRINCIPE: L'IRPP frappe les revenus des personnes physiques residentes ou non residentes ayant des revenus de source senegalaise.
BAREME IRPP SENEGAL 2025:
- Tranche 1 : 0 - 630 000 FCFA : 0%
- Tranche 2 : 630 001 - 1 500 000 FCFA : 20%
- Tranche 3 : 1 500 001 - 4 000 000 FCFA : 30%
- Tranche 4 : 4 000 001 - 8 000 000 FCFA : 35%
- Tranche 5 : Au-dela de 8 000 000 FCFA : 40%
CATEGORIES DE REVENUS:
- Revenus fonciers, BIC, BNC, revenus de capitaux mobiliers, salaires
RETENUE A LA SOURCE SUR SALAIRES:
- Employeur preleve et reverse mensuellement
- Declaration avant le 15 du mois suivant
REFERENCES: Art. 81 a 240 CGI Senegal | DGID`,

  `=== SEN-05 | RETENUES SOURCE | RETENUES A LA SOURCE - SENEGAL ===
TITRE: Retenues a la source - Senegal 2025
PRINCIPE: Certains paiements donnent lieu a une retenue a la source que le debiteur doit prelever et reverser a la DGID.
PRINCIPAUX TAUX:
- Dividendes verses a des residents : 10%
- Dividendes verses a des non-residents : 10%
- Interets sur depots et obligations : 8%
- Redevances versees a des non-residents : 20%
- Prestations de services rendues par des non-residents : 20%
- Loyers verses a des personnes physiques : 5%
- Commissions, courtages, honoraires (residents) : 3%
- March\u00e9s publics > 500 000 FCFA : 3%
REVERSEMENT:
- Avant le 15 du mois suivant le paiement
- Via e-tax DGID
REFERENCES: Art. 240 bis a 240 octies CGI Senegal | DGID`,

  `=== SEN-06 | CGU | CONTRIBUTION GLOBALE UNIQUE - SENEGAL ===
TITRE: Contribution Globale Unique (CGU) - Regime des petites entreprises Senegal
PRINCIPE: La CGU remplace plusieurs impots pour les petites entreprises dont le CA est inferieur au seuil TVA. Elle remplace IS, IRPP, TVA, patente et CFE.
SEUIL ET TAUX CGU:
- Applicable : CA annuel < 50 millions FCFA
- Taux CGU : varie selon le secteur et le CA
  * Commerce : 4% du CA
  * Services : 6% du CA
  * Artisanat : 3% du CA
MINIMUM CGU :
- Minimum : 100 000 FCFA/an
PAIEMENT:
- Paiement trimestriel (25% chaque trimestre)
- Declaration annuelle avant le 30 avril
NOTE: La CGU correspond approximativement au regime de l'Entreprenant au Togo (TPU)
REFERENCES: Art. 669 a 680 CGI Senegal | DGID`,

  `=== SEN-07 | PATENTE | CONTRIBUTION PATENTE - SENEGAL ===
TITRE: Contribution des Patentes - Senegal
PRINCIPE: La patente est due par toute personne physique ou morale exer\u00e7ant une activite commerciale, industrielle ou liberale au Senegal.
DETAILS:
- Calculee sur la valeur locative des locaux professionnels
- Taux : variable selon la nature et l'importance de l'activite
- Droit fixe + droit proportionnel
- Exoneration la 1ere annee d'activite
- Declaration avant le 31 mars de chaque annee
- Applicable aux entreprises assujetties au reel (CA > 50M FCFA)
- Les entreprises sous CGU sont exonerees de patente
REFERENCES: Art. 571 a 617 CGI Senegal | DGID`,

  `=== SEN-08 | FONCIER | CONTRIBUTION FONCIERE - SENEGAL ===
TITRE: Contribution Fonciere des Proprietes Baties et Non Baties (CFE/CFU) - Senegal
PRINCIPE: Impot annuel sur les proprietes immobilieres situees au Senegal.
DETAILS:
CONTRIBUTION FONCIERE DES PROPRIETES BATIES (CFB) :
- Assiette : valeur locative annuelle des immeubles batis
- Taux : 5% de la valeur locative
- Due par le proprietaire ou l'usufruitier
CONTRIBUTION FONCIERE DES PROPRIETES NON BATIES (CFU) :
- Assiette : valeur venale des terrains non batis
- Taux : 5% de la valeur venale
- Due par le proprietaire
EXONERATIONS:
- Immeubles affectes a un usage d'habitation principale (sous conditions)
- Batiments agricoles
- Proprietes de l'Etat et des collectivites locales
REFERENCES: Art. 517 a 570 CGI Senegal | DGID`,

  `=== SEN-09 | ENREGISTREMENT | DROITS D'ENREGISTREMENT - SENEGAL ===
TITRE: Droits d'enregistrement - Senegal 2025
PRINCIPE: Les actes juridiques et mutations de propriete sont soumis aux droits d'enregistrement.
PRINCIPAUX TAUX:
- Cession de fonds de commerce : 5% de la valeur
- Cession d'immeubles : 5% de la valeur venale
- Cession d'actions de SA : 1%
- Cession de parts sociales (SARL) : 2%
- Baux commerciaux : 2% du loyer annuel
- Contrats de pret : 1% du montant
- Constitution de societe : droit fixe 25 000 FCFA
- Augmentation de capital : 1% du montant de l'augmentation
DELAI D'ENREGISTREMENT:
- Actes sous seing prive : 30 jours
- Actes notaries : immediat
REFERENCES: Art. 462 a 516 CGI Senegal | DGID`,

  `=== SEN-10 | LF2026 | LOI DE FINANCES 2026 - SENEGAL ===
TITRE: Loi de Finances 2026 Senegal - Principales mesures
PRINCIPE: La loi de finances pour l'exercice 2026 au Senegal introduit plusieurs reformes fiscales dans un contexte de politique budgetaire rigoureuse.
MESURES CLES LF2026 SENEGAL:
- Renforcement de la facturation electronique pour les entreprises du reel
- Elargissement de l'assiette CGU : harmonisation des taux sectoriels
- Mesures incitatives pour les investissements dans les energies renouvelables
- Renforcement des controles sur les prix de transfert (multinationales)
- Digitalisation des procedures DGID : e-tax etendu aux PME
- Renforcement des retenues sur prestations de services non-residents
BUDGET 2026 SENEGAL:
- Budget en equilibre a environ 6 000 milliards FCFA
- Pression fiscale ciblee : 20% du PIB (objectif UEMOA)
NOTE: La KB Senegal sera mise a jour au fur et a mesure de la publication des textes d'application
REFERENCES: Loi de Finances 2026 Senegal | DGID | Ministere des Finances`,

  `=== SEN-11 | SYSCOHADA | SYSCOHADA AU SENEGAL ===
TITRE: Application du SYSCOHADA au Senegal
PRINCIPE: Le Senegal, en tant qu'Etat membre OHADA, applique le SYSCOHADA Revise 2017. Les regles comptables sont identiques a celles du Togo.
DETAILS:
- Referentiel : SYSCOHADA Revise 2017 (Acte Uniforme du 26 janvier 2017)
- Memes classes de comptes 1 a 9 qu'au Togo
- Memes etats financiers : Bilan, Compte de resultat, TFT, Notes annexes
- Depot des etats financiers : aupres de la DGID et du RCCM
- Delai de depot : avant le 30 avril de l'annee N+1
- Systeme Normal applicable aux grandes et moyennes entreprises
- SMT (Systeme Minimal de Tresorerie) pour les petites entites
DIFFERENCE PRINCIPALE AVEC LE TOGO:
- Au Senegal la liasse est deposee aupres de la DGID (pas de GUDEF comme au Togo)
- L'Ordre National des Experts Comptables du Senegal (ONECS) supervise la profession
REFERENCES: AUDCIF OHADA 2017 | DGID Senegal | ONECS`,

  `=== SEN-12 | CONTROLE | CONTROLE FISCAL - SENEGAL ===
TITRE: Controle fiscal et procedures - Senegal
PRINCIPE: La DGID dispose de pouvoirs etendus de controle et de verification des declarations fiscales.
TYPES DE CONTROLE:
- Controle sur pieces (bureau) : verification des declarations sans deplacement
- Verification de comptabilite : examen des documents comptables en entreprise
- Examen de situation fiscale personnelle (ESFP) : pour les personnes physiques
DELAIS DE PRESCRIPTION:
- Droit de reprise general : 3 ans apres l'annee d'imposition
- En cas de fraude : 6 ans
DROITS DU CONTRIBUABLE:
- Droit de reponse aux observations du verificateur : 30 jours
- Possibilite de saisir la Commission de Conciliation
- Recours hierarchique aupres du Directeur General des Impots
- Recours contentieux devant le tribunal
SANCTIONS:
- Penalites de retard : 5% du montant d\u00fb par mois (plafonn\u00e9 a 25%)
- Amendes pour defaut de declaration : 50 000 a 500 000 FCFA
- Sanctions penales en cas de fraude av\u00e9ree
REFERENCES: Livre des Procedures Fiscales (LPF) Senegal | DGID`,

  `=== SEN-13 | IPRES | COTISATIONS SOCIALES - SENEGAL ===
TITRE: Cotisations sociales IPRES et CSS - Senegal
PRINCIPE: Les cotisations sociales au Senegal sont reparties entre l'IPRES (retraite) et la CSS (Caisse de Securite Sociale).
IPRES (Institut de Prevoyance Retraite du Senegal):
- Regime general : Patronal 8,4% + Salarial 5,6% = 14% (plafond 360 000 FCFA/mois)
- Regime cadres : Patronal 3,6% + Salarial 2,4% = 6% (plafond 1 296 000 FCFA/mois)
CSS (Caisse de Securite Sociale):
- Prestations familiales : 7% a la charge du patron (plafond 63 000 FCFA/mois)
- Accidents du travail : 1% a 5% selon secteur (charge patronale)
- Assurance maladie : variable selon accord d'entreprise
DECLARATION ET PAIEMENT:
- Declaration et paiement mensuel avant le 15 du mois suivant
- Penalite de retard : 10% du montant d\u00fb
REFERENCES: Code de Securite Sociale Senegal | IPRES | CSS`,

  `=== SEN-14 | OHADA | DROIT DES SOCIETES OHADA - SENEGAL ===
TITRE: Droit des societes OHADA applicable au Senegal
PRINCIPE: Le Senegal applique l'Acte Uniforme OHADA relatif au droit des societes commerciales et du groupement d'interet economique (AUSCGIE).
FORMES JURIDIQUES PRINCIPALES:
- SA (Societe Anonyme) : capital minimum 10 millions FCFA
- SARL (Societe a Responsabilite Limitee) : capital minimum 100 000 FCFA
- SNC (Societe en Nom Collectif) : pas de capital minimum
- Entreprise Individuelle : immatriculation au RCCM
- GIE (Groupement d'Interet Economique)
IMMATRICULATION:
- Registre du Commerce et du Credit Mobilier (RCCM) - Tribunal de Commerce
- Numero NINEA (Numero d'Identification Nationale des Entreprises et Associations) = equivalent du NIF togolais
- Centre de Formalites des Entreprises (CFE) pour creation rapide
REFERENCES: AUSCGIE OHADA | RCCM Senegal | CFE Dakar`,

  `=== SEN-15 | RECAPITULATIF | COMPARAISON TOGO vs SENEGAL ===
TITRE: Comparaison fiscale Togo vs Senegal - Points cles
TABLEAU COMPARATIF:
IMPOT SUR LES SOCIETES:
- Togo : 27% | Senegal : 30%
- MFP Togo : 1% CA | MFP Senegal : 0,5% CA (min 500 000 FCFA)
TVA:
- Taux Togo : 18% | Taux Senegal : 18% (identique)
- Seuil Togo : 100 millions FCFA | Seuil Senegal : 50 millions FCFA
REGIME PETITES ENTREPRISES:
- Togo : TPU (Taxe Professionnelle Unique) / Regime Entreprenant
- Senegal : CGU (Contribution Globale Unique) - meme concept
RETENUES DIVIDENDES:
- Togo : 13% residents / 15% non-residents | Senegal : 10% (les deux)
ORGANES FISCAUX:
- Togo : OTR (Office Togolais des Recettes)
- Senegal : DGID (Direction Generale des Impots et Domaines)
DECLARATIONS EN LIGNE:
- Togo : e-tax OTR | Senegal : e-tax DGID
COMPTABILITE:
- Les deux pays : SYSCOHADA Revise 2017 (identique)
REFERENCES: CGI Togo 2025 | CGI Senegal 2025 | SYSCOHADA 2017`,

];

export const KB_SENEGAL_N = KB_SENEGAL.length;

export function searchKBSENEGAL(query, topK) {
  topK = topK || 3;
  var q = query.toLowerCase();
  var tokens = q.split(/\s+/).filter(function(t){ return t.length > 2; });
  return KB_SENEGAL
    .map(function(sec){
      var s = sec.toLowerCase();
      var score = tokens.reduce(function(acc, t){ return acc + (s.split(t).length - 1); }, 0);
      return { sec: sec, score: score };
    })
    .filter(function(x){ return x.score > 0; })
    .sort(function(a, b){ return b.score - a.score; })
    .slice(0, topK)
    .map(function(x){ return x.sec; });
}
